
const randomBytes = require('crypto').randomBytes;

const aws = require('aws-sdk');
aws.config.update({region: 'us-east-1'});

var ses = new aws.SES();

function recordMsg(emailId, username, useremail, message) {
    var awsDb = require('aws-sdk');
    awsDb.config.update({region: 'us-east-2'});
    var ddb = new awsDb.DynamoDB({apiVersion: '2012-08-10'});
    return ddb.putItem({
        TableName: 'email-table',
        Item: {
            "email-id": {S: emailId},
            "name": {S: username},
            "email": {S: useremail},
            "body": {S: message}
        },
    }, function(err, data){
        if (err){
            console.log("Error", err);
        }
        else {
            console.log("Success", data);
        }
    });
}

function toUrlString(buffer) {
    return buffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function errorResponse(errorMessage, awsRequestId, callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
    }),
    headers: {
 'Content-Type': 'application/json', 'Access-Control-Allow-Headers': 'x-requested-with',
 "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true,
}
,
  });
}

exports.handler = async (event, context, callback) => {
    try{
    const emailId = toUrlString(randomBytes(16));
    console.log('Received event (', emailId, '): ', event);


    const requestBody = JSON.parse(JSON.stringify(event));

    recordMsg(emailId, requestBody.fullname, requestBody.email, requestBody.additionalInfo);
    
   var params = {
        Destination: {
            ToAddresses: ["bogus12@gmail.com"]
        },
        Message: {
            Body: {
                Text: { Data: "FROM: " + requestBody.fullname + "\n" +
                        "EMAIL: " + requestBody.email + "\n" +
                        "MESSAGE: " + requestBody.additionalInfo
                    
                }
                
            },
            
            Subject: { Data: "Feedback from: " + requestBody.fullname
                
            }
        },
        Source: "bogus12@gmail.com"
    };

    
     ses.sendEmail(params, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            
            console.log(data);
        }
    });
    
    
    callback(null, {
        statusCode: 201,
       headers: {
 'Content-Type': 'application/json', 'Access-Control-Allow-Headers': 'x-requested-with',
 "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true,
}
,
    });
    }
    catch(err)  {
        console.error(err);

        errorResponse(err.message, context.awsRequestId, callback);
    }
};
