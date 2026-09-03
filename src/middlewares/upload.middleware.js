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
            } else if (file.fieldname === 'thumbnail') {
                cb(null, 'uploads/thumbnails/');
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

// Profile photo specific limit
const uploadPhoto = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Videos and thumbnails (no strict global limit, handled manually in wrapper)
const uploadVideo = multer({
    storage: storage
});

// Wrapper function to catch Multer errors (like size limit) and return a nice JSON response
const uploadSinglePhoto = (req, res, next) => {
    const uploadMiddleware = uploadPhoto.single('photo');

    uploadMiddleware(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, message: 'File is too large. Max size is 5MB for photos.' });
            }
            return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
            return res.status(500).json({ success: false, message: 'Unknown upload error occurred' });
        }
        next();
    });
};

const uploadVideoAndThumbnail = (req, res, next) => {
    const uploadMiddleware = uploadVideo.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]);
    
    uploadMiddleware(req, res, function (err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Upload error occurred' });
        }
        
        // Manual check for thumbnail size (2MB) as requested
        if (req.files && req.files['thumbnail'] && req.files['thumbnail'][0]) {
            if (req.files['thumbnail'][0].size > 2 * 1024 * 1024) {
                return res.status(400).json({ success: false, message: 'Thumbnail file is too large. Max size is 2MB.' });
            }
        }
        
        next();
    });
};

module.exports = {
    uploadSinglePhoto,
    uploadVideoAndThumbnail
};
