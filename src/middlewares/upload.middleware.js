const multer = require('multer');
const path = require('path');

let storage;

if (process.env.STORAGE_PROVIDER === 'local') {
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            // Determine folder based on fieldname or you can pass it in
            if (file.fieldname === 'photo') {
                cb(null, 'uploads/profiles/');
            } else if (file.fieldname === 'video') {
                cb(null, 'uploads/videos/');
            } else {
                cb(null, 'uploads/');
            }
        },
        filename: (req, file, cb) => {
            // Create a unique filename
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });
} else if (process.env.STORAGE_PROVIDER === 's3') {
    // AWS S3 implementation will go here later
}

// Set up the multer instance with the 5MB size limit
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Wrapper function to catch Multer errors (like size limit) and return a nice JSON response
const uploadSinglePhoto = (req, res, next) => {
    const uploadMiddleware = upload.single('photo');

    uploadMiddleware(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading (e.g., File too large)
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, message: 'File is too large. Max size is 5MB for photos.' });
            }
            return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
            // An unknown error occurred
            return res.status(500).json({ success: false, message: 'Unknown upload error occurred' });
        }
        
        // Everything went fine
        next();
    });
};

module.exports = {
    uploadSinglePhoto
};
