const multer = require('multer');
const path = require('path');

const formattedDate = new Date().toLocaleDateString().replace(/\//g, '-');
const storage = multer.diskStorage({
    destination:'./uploads/',
    filename: (req, file, cb) => cb(null, `${file.fieldname}-${formattedDate}${path.extname(file.originalname)}`),
});
const upload = multer({ storage }).single('profileImage');

module.exports = upload;