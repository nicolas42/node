var AWS = require('aws-sdk');

process.env.AWS_REGION = 'ap-southeast-2';
AWS.config.logger = process.stdout;
s3 = new AWS.S3

// get https://bitwise-public.s3-ap-southeast-2.amazonaws.com/GH010003out.mp4
s3bucket = new AWS.S3({params: {Bucket: 'bitwise-training-videos'}});
resp=s3bucket.getObject({Key: 'greenview-fpg-b11/GH010002.MP4'}).send();






const file = resp.data.Body




const gpmfExtract = require('gpmf-extract');
const goproTelemetry = require(`gopro-telemetry`);
const fs = require('fs');
const toGeojson = require('gopro-telemetry/code/toGeojson');

// const file = fs.readFileSync('/Users/nick2/bitwise/20200206-bitwise_large_files/GH010002.MP4');
let telemetry;
let geojson;

(async () => {
    let extracted = await gpmfExtract(file);
    telemetry = goproTelemetry(extracted);
    geojson = toGeojson(telemetry, {});
})();


