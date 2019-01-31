const AWS = require('aws-sdk');
const config = require('../config/config');

const S3config = {
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'eu-west-2:90eb0678-13b8-4637-9162-0d4d7668e856'
    }),
    region: 'eu-west-2', //Set for London Region
};

AWS.config.update(S3config);

const S3 = new AWS.S3({
    apiVersion: '2006-03-01'
});


exports.S3 = S3;
