import express from 'express';
import { addSeedsCategories, getALlData, getAllSeeds } from '../controllers/DataControlles.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Temporary local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(__dirname, '../tempUploads');
    fs.mkdirSync(tempDir, { recursive: true });
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get('/get-data', getALlData);
//seeds
router.get('/get-seeds-data', getAllSeeds);
router.post('/add-seeds-categories', upload.single('image'), addSeedsCategories);

export default router;