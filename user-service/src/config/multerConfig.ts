// multerConfig.ts
import multer, { StorageEngine } from 'multer';
import { Request } from 'express';

// Multer storage configuration
const storage: StorageEngine = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: (error: (Error | null), destination: string) => void): void {
        cb(null, 'src/assets/images/'); // Destination folder for storing uploaded files
    },
    filename: function (req: Request, file: Express.Multer.File, cb: (error: (Error | null), filename: string) => void): void {
        cb(null, Date.now() + '-' + file.originalname); // File naming convention
    }
});

// Multer upload instance
const upload = multer({ storage: storage });

export default upload.single('profile');
