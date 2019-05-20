const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3-transform');
const localConfig = require('../localConfig');
const sharp = require('sharp');

const IMAGE_TYPE = {
    ORIGINAL: 0,
    THUMBNAIL: 1
}

aws.config.update(localConfig.s3);

const s3 = new aws.S3();

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: localConfig.s3.bucket_name,
        shouldTransform: function(req, file, callback) {
            callback(null, /^image/i.test(file.mimetype));
        },
        transforms: [
            {
                id: 'original',
                key: function(req, file, callback) {
                    callback(null, req.user_id);
                },
                transform: function(req, file, callback) {
                    //Perform desired transformations
                    callback(null, sharp().resize(600, 600));
                },                
            },
        ],
        contentType: function(req, file, callback) {
            callback(null, file.mimetype);
        },       
    }),
});

module.exports = upload;
module.exports.IMAGE_TYPE = IMAGE_TYPE;
