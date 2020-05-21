var aws = require('aws-sdk');
var path = require("path");
var fs = require('fs');

const input_path = '/users/nick/Downloads/misc'

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

files = [];
walkSync(input_path, (path, stat)=>{ files.push(path); });


files.forEach((filePath)=>{

//  var filePath = '/Users/Nick/Downloads/misc/a.dmg';

  const upload = new aws.S3.ManagedUpload({
    partSize: 5 * 1024 * 1024,
    queueSize: 10,
    params: {
      Bucket: 'bitwise-nick',
      Key: filePath,
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

});