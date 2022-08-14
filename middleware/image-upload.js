const multer = require('multer');
const uuid = require('uuid').v4;    //generate unique id 

const upload = multer({
    storage: multer.diskStorage({
      destination: 'product-data/images',
      filename: function(req, file, cb) {
        cb(null, uuid() + '-' + file.originalname);  //generate unique file name with file extension
        }
    })
});

const configuredMulterMiddleware = upload.single('image');

module.exports = configuredMulterMiddleware;