const AWS = require('aws-sdk');


const s3 = new AWS.S3();

exports.handler = async (event) => {
    var params = { 
        Bucket: 'bitwise-public',
        Key: 'key.txt',
    };
    const data = await s3.getObject(params).promise();

    const response = {
        statusCode: 200,
        body: JSON.stringify(data),
    };
    return response;
};
