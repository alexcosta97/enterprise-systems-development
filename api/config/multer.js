const multer = require('multer');
const {S3} = require('../services/AWSS3');
const multerS3 = require('multer-s3');

const upload = multer({
    storage: multerS3({
        s3: S3,
        bucket: '360rooms.21611431',
        acl: 'public-read-write',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function(req, file, cb){
            var ext = file.mimetype.split('/')[1];
            cb(null, `${Date.now()}.${ext}`)
        }
    })
});

module.exports = upload;
