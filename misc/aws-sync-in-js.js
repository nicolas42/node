// aws sdk nodejs stuff
// API reference https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/
// github https://github.com/aws/aws-sdk-js
// special sync package https://www.npmjs.com/package/s3-sync-aws

// s3 api https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
// aws cli (python) https://github.com/aws/aws-cli

// https://stackoverflow.com/questions/53660683/aws-lambda-using-s3-getobject-function-nothing-happening

const AWS = require('aws-sdk')
const co = require('co')
const fs = require('fs')
AWS.config.update({ region: 'ap-southeast-2' })
AWS.config.setPromisesDependency(Promise)
const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

function listFiles(dir, acc) {
  const files = fs.readdirSync(dir) || []
  files.forEach((value) => {
    const name = `${dir}/${value}`
    if (fs.statSync(name).isDirectory()) {
      listFiles(name, acc)
    } else {
      acc.push(name)
    }
  })
  return acc
}

co(function* () {
  const backetId = 'bitwise-nick'
  const files = listFiles('node_modules', [])
  for (const file of files) {
    console.log('uploading file: ', file)
    yield s3.upload({
      Bucket: backetId,
      Key: file,
      Body: fs.readFileSync(file),
    }).promise()
  }
})
  .catch((err) => {
    console.log('get error: ', err)
  })