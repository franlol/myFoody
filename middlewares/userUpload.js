'use strict';

const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: 'jeseh',
    api_key: 924699538261193,
    api_secret: 'HaO75L3PIOE5iBSftdvcNLKKiPc'
});

const storage = cloudinaryStorage({
    cloudinary,
    folder: 'myFoody-Users',
    allowedFormats: ['jpg', 'png', 'jpeg']
});

const parserUser = multer({
    storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
            req.fileValidationError = true;
            return cb(null, false, new Error('Wrong file type uploaded'));
        }
        cb(null, true);
    }
});

module.exports = parserUser;
