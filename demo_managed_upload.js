var aws = require('aws-sdk');
var path = require("path");
var fs = require('fs');

var filePath = '/Users/Nick/Downloads/misc/a.dmg';
const upload = new aws.S3.ManagedUpload({
  partSize: 5 * 1024 * 1024,
  queueSize: 1,
  params: {
    Bucket: 'bitwise-nick',
    Key: 'a.dmg',
    Body: fs.createReadStream(filePath)
  }
});

upload.on('httpUploadProgress', (event) => {
//   console.log(event.loaded * 100 / event.total);
  var t2 = Date.now();  
  console.log( event.loaded / (t2 - t1) + ' bytes/s');
});

var t1 = Date.now()
upload.send((error, result) => {
  console.log('Done');
});
