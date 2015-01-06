"use strict";

var program = require('commander'), 
    FastStats = require('fast-stats').Stats,
    redis = require('redis'),
    child_process = require('child_process'),
    fs = require('fs'),
    packageJson = require('../package.json');


program
    .version(packageJson.version)
    .usage("[options] <key>")
    .option("-p, --port [port]", "Redis port", "6379")
    .option("-h, --host [host]", "Redis host", "localhost")
    .option("-b, --buckets [buckets]", "Number of histogram buckets")
    .parse(process.argv);

var zsetKey = program.args[0];
var redisClient = redis.createClient(program.port, program.host);

redisClient.zrevrange([zsetKey, 0, -1, "WITHSCORES"], function(err, zsetData){
    var memberCount = zsetData.length / 2;
    var members = [];
    var scores = [];

    for(var i = 0; i < zsetData.length; i++) {
        if(i % 2 === 0) members.push(zsetData[i]);
        else {
            scores.push(parseFloat(zsetData[i]));
        }
    }

    // Calculate and print basic stats
    var bucketCount = program.buckets || 10;
    var bucketPrecision = ((scores[0] - scores[scores.length - 1])/bucketCount);
    var stats = new FastStats({ bucket_precision: bucketPrecision }).push(scores);

    var memberMin = members[memberCount - 1]; 
    var scoreMin = scores[memberCount - 1];
    var memberMax = members[0];
    var scoreMax = scores[0];
    var arithMean = stats.amean();
    var geoMean = stats.gmean();
    var median = stats.median();
    var percentile90 = stats.percentile(90);
    var percentile95 = stats.percentile(95);
    var percentile99 = stats.percentile(99);
    var arithStdDev = stats.σ();
    var geoStdDev = stats.gstddev();
    var moe = stats.moe();

    console.log("Members:               " + memberCount);
    console.log("Min:                   " + scoreMin + " (" + memberMin + ")");
    console.log("Max:                   " + scoreMax + " (" + memberMax + ")");
    console.log("Mean:                  " + arithMean);
    console.log("StdDev:                " + arithStdDev);
    console.log("Median:                " + median);
    console.log("90th Percentile:       " + percentile90);
    console.log("95th Percentile:       " + percentile95);
    console.log("99th Percentile:       " + percentile99);
    console.log("Mean (geometric):      " + geoMean);
    console.log("StdDev (geometric):    " + geoStdDev);
    console.log("Margin of Error:       " + moe);


    // Construct the histogram and save to temp file
    var dist = stats.distribution(); 
    var fileName = "/tmp/"+zsetKey+".txt";
    fs.writeFileSync(fileName, "");
    for(var j = 0; j < dist.length; j++){
        if(dist[j]) 
            fs.appendFileSync(fileName, parseInt(dist[j].bucket).toString() + " " + dist[j].count.toString() + "\n");
    }

    //console.log(fs.readFileSync(fileName, {encoding: 'utf8'}));

    // Plot from histogram from file via gnuplot
    var setTerm = 'set terminal dumb;';
    var setTitle = 'set title "ZSET Plot: '+zsetKey+'";';
    var setStyle = 'set xtics rotate out;set style data histogram;set xlabel "Bucket Mean";set ylabel "Bucket Count";';
    var setYRange = "set auto y;";
    var plot = 'plot "' + fileName + '" using 2:xticlabels(1) notitle;';

    child_process.exec("gnuplot -e '" + setTerm + setTitle + setStyle + setYRange + plot + "'", function(err, stdout, stderr){
        console.log(stdout);
        process.exit(0);
    });
});
