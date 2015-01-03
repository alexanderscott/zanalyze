"use strict";

var program = require('commander'), 
    FastStats = require('fast-stats').Stats,
    redis = require('redis'),
    packageJson = require('../package.json');


program
    .version(packageJson.version)
    .usage("[options] <key>")
    .option("-p, --port [port]", "Redis port", "6379")
    .option("-h, --host [host]", "Redis host", "localhost")
    .parse(process.argv);

var zsetKey = program.args[0];
var redisClient = redis.createClient(program.port, program.host);

redisClient.zrevrange([zsetKey, 0, -1, "WITHSCORES"], function(err, zsetData){
    if(err) {
        console.error(err);
        process.exit(1);
    }

    var memberCount = zsetData.length / 2;
    var members = [];
    var scores = [];

    for(var i = 0; i < zsetData.length; i++) {
        if(i % 2 === 0) members.push(zsetData[i]);
        else {
            scores.push(parseFloat(zsetData[i]));
        }
    }

    var stats = new FastStats().push(scores);

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

    process.exit(0);
});
