var AWS = require('aws-sdk');
var path = require("path");
var fs = require('fs');

const uploadDir = function(s3Path, bucketName) {

    let s3 = new AWS.S3();

    function walkSync(currentDirPath, callback) {
        fs.readdirSync(currentDirPath).forEach(function (name) {
            var filePath = path.join(currentDirPath, name);
            var stat = fs.statSync(filePath);
            if (stat.isFile()) {
                callback(filePath, stat);
            } else if (stat.isDirectory()) {
                walkSync(filePath, callback);
            }
        });
    }

    walkSync(s3Path, function(filePath, stat) {
        let bucketPath = filePath.substring(s3Path.length+1);
        var options = {partSize: 10 * 1024 * 1024, queueSize: 1};

        const stream = fs.createReadStream(filePath);
        let params = {Bucket: bucketName, Key: bucketPath, Body: stream };
        console.log('Uploading '+ bucketPath +' to ' + bucketName + '...');
        s3.upload(params, options, function(err, data) {
            if (err) {
                console.log(err)
            } else {
                console.log('Successfully uploaded '+ bucketPath +' to ' + bucketName);
            }
        });

    });
};

uploadDir("node_modules", "bitwise-nick/test");