"use strict";

var redis = require('redis');
var zsetKey = process.argv[2];
var redisClient = redis.createClient();

function normalSeed() {
    return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
}

function loadSampleData(cb){
    var multi = redisClient.multi();
    multi.del([zsetKey]);
    for(var i = 0; i < 5000; i++){
        var score = normalSeed() * 100;
        var member = parseInt(Math.random() * 10000).toString();
        multi.zadd([zsetKey, score, member]);
    }
    multi.exec(cb);
};

loadSampleData(function(err){
    process.exit(0);
});


