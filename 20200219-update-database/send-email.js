// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

var aws = require('aws-sdk');
var ses = new aws.SES({region: 'ap-southeast-2'});

exports.handler = (event, context, callback) => {
    
     var params = {
        Destination: {
            ToAddresses: ["nick@bitwiseag.com"]
        },
        Message: {
            Body: {
                Text: { Data: "OMG someone created a file in s3://greenview-fpg!!!"
                    
                }
                
            },
            
            Subject: { Data: "Test Email"
                
            }
        },
        Source: "nick@bitwiseag.com"
    };

    
     ses.sendEmail(params, function (err, data) {
        callback(null, {err: err, data: data});
        if (err) {
            console.log(err);
            context.fail(err);
        } else {
            
            console.log(data);
            context.succeed(event);
        }
    });
};