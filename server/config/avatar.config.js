// multerConfig.js
const multer = require("multer");
const path = require("path");

// Set up storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public/users/")); // Specify the destination folder
    },
    filename: (req, file, cb) => {
        // Use the original name or create a unique name
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            "user_avatar__" +
                    Math.floor(100000 + Math.random() * 900000).toString() +
                    path.extname(file.originalname)
        );
    }
});

// Create the multer instance
const upload = multer({ storage: storage });

// Export the upload middleware
module.exports = upload;
