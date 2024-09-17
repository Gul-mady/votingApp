const multer = require('multer');
const path = require('path');

// Single middleware function for handling file uploads
const uploadMiddleware = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            // Directory to save uploaded files
            cb(null, 'uploads');
        },
        filename: (req, file, cb) => {
            // Append timestamp to file name
            cb(null, Date.now() + path.extname(file.originalname));
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    // fileFilter: (req, file, cb) => {
    //     // Allow only image files
    //     const allowedTypes = /jpeg|jpg|png|gif/;
    //     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    //     const mimetype = allowedTypes.test(file.mimetype);

    //     if (mimetype && extname) {
    //         return cb(null, true);
    //     } else {
    //         cb(new Error('Only image files are allowed.'));
    //     }
    // }
}).single('profilePicture'); // Use 'profilePicture' as field name

module.exports = uploadMiddleware;
