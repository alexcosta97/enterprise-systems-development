const AWS = require('aws-sdk');
const config = require('../config/config');

const S3config = new AWS.config({
    accessKeyId: config.awsAccessKeyID,
    secretKeyAccessKey: config.awsSecretAccessKey,
    region: 'eu-west-2', //Set for London Region
    apiVersion: '2006-03-01',
    params: {
        Bucket: '360rooms.21611431'
    }
});

const S3 = new AWS.S3(S3config);

const uploadPhoto = (photo, fileName) => {
    S3.upload({
        Key: fileName,
        Body: photo,
        ACL: 'public-read-write'
    }, (err, data) => {
        if(err) return err;
        else return data.Location;
    });
};

exports.S3 = S3;
exports.uploadPhoto = uploadPhoto;