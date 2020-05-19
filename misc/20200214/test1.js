var AWS = require('aws-sdk');
process.env.AWS_REGION = 'ap-southeast-2';
AWS.config.logger = process.stdout;
var promise = new AWS.S3().getObject({Bucket: 'bitwise-public', Key: 'key.txt'}).promise();
