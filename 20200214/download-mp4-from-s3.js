var AWS = require('aws-sdk');
const gpmfExtract = require('gpmf-extract');
const goproTelemetry = require(`gopro-telemetry`);
const toGeojson = require('gopro-telemetry/code/toGeojson');


// process.env.AWS_REGION = 'ap-southeast-2';
// AWS.config.logger = process.stdout;

// let telemetry;
// let resp;
// let extracted;
// let file;
let geojson;


(async () => {
    resp = await new AWS.S3().getObject({Bucket: 'bitwise-training-videos', Key: 'greenview-fpg-b11/GH010002.MP4'}).promise();
    file = resp.Body;
    extracted = await gpmfExtract(file);
    telemetry = goproTelemetry(extracted);
    geojson = toGeojson(telemetry, {});
})();


