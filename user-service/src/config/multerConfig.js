//multerConfig.js

import multer from 'multer';
// Multer storage configuration
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'src/assets/images/'); // Destination folder for storing uploaded files
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // File naming convention
  }
});
// Multer upload instance
const upload  = multer({ storage: storage });

export default upload.single('profile')
