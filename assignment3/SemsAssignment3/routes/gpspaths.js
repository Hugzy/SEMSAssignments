var express = require('express');
var router = express.Router();
const csv = require('csv-parser')
const Stopwatch = require('timer-stopwatch');
const fs = require('fs')
// const { performance } = require('perf_hooks');
var options = {refreshRateMS: 0.1}
const cache = [];

router.get('/', function(req, res, next) {
    let isMean = parseBool(req.query.mean)
    let isMedian = parseBool(req.query.median)
    let csvFile = req.query.csv
    let interval = req.query.interval
    // var t0 = performance.now();
    parseCsv(isMean,isMedian,csvFile,interval,res)
    // var t1 = performance.now()
    // console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
});

router.get('/cache', function (req, res, next) {
    let isMean = parseBool(req.query.mean)
    let isMedian = parseBool(req.query.median)
    let csvFile = req.query.csv
    let interval = req.query.interval
    // var t0 = performance.now();
    let result = checkCache(isMean,isMedian,csvFile,interval)
    if(result === undefined){
        parseCsv(isMean,isMedian,csvFile,interval,res)
    }
    res.json(result);
    // var t1 = performance.now()
    // console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
})

module.exports = router;
function parseBool(value) {
    return value == "true" ? true : false;
}

function parseCsv(isMean,isMedian, csvFile, interval, res) {
    let results = [];
    fs.createReadStream(csvFile)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            if(isMean){
                results = mean(results, interval)
                cache.push({key: `mean,${csvFile},${interval}`, value: results})
            } else if (isMedian){
                results = median(results, interval)
                cache.push({key: `median,${csvFile},${interval}`, value: results})
            }

            res.json(results)
        });
}

function mean(results, interval) {
    let meanResult = []

    for (let i = 0,p = 0; i < results.length; i-=-interval, p++) {
        let meanLong = 0
        let meanLat = 0
        let actualInterval = 0
        for (let j = 0; j < interval && i+j < results.length; j++) {
            meanLong += parseFloat(results[i+j].phone_long)
            meanLat += parseFloat(results[i+j].phone_lat)
            actualInterval++
        }
        meanLong = meanLong/actualInterval
        meanLat = meanLat/actualInterval
        meanResult[p] = {meanLong, meanLat}
    }
    return meanResult
}

function median(results, interval) {
    let medianResult = []
    for (let i = 0,p=0; i < results.length && i + (interval/2) < results.length ; i-=-interval,p++) {
        var index = parseInt(i + (interval/2));
        medianResult[p] = {"medianLong": results[index].phone_long,"medianLat": results[index].phone_lat }
    }
    return medianResult
}

function checkCache(isMean, isMedian, csvFile, interval) {
    if (isMedian) {
        let key = makeMedianKey(csvFile, interval)
        return cache.find(obj => obj.key === key).value
    } else {
        let key = makeMeanKey(csvFile,interval)
        return cache.find(obj => obj.key === key).value
    }
}

function makeMedianKey(csvFile, interval) {
    return`median,${csvFile},${interval}`
}

function makeMeanKey(csvFile, interval) {
    return`mean,${csvFile},${interval}`
}