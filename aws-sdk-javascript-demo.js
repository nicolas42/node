// run in console
// typically functions require callback
// requires npm install aws-sdk

// format json with tabs
// JSON.stringify(arg,0,4)

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

resp = s3.listBuckets().send(); null
// resp.data


var params = { 
    Bucket: 'bitwise-nick',
    Key: 'test.txt',
};
resp = s3.getObject(params).send(); null;
// resp.data.Body.toString()


