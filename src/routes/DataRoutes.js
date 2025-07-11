import express from 'express';
import { addSeedsCategories, getALlData, getAllSeeds } from '../controllers/DataControlles.js';
import cloudinary from '../config/cloudinary/cloudinary.js';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'uploads',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});
const upload = multer({ storage });

router.get('/get-data', getALlData);
//seeds
router.get('/get-seeds-data', getAllSeeds);
router.post('/add-seeds-categories', upload.single('image'), addSeedsCategories);

export default router;

//   const category = doc[section].data.find(cat => cat._id.toString() === id);
//   if (!category) return res.status(404).json({ message: 'Category ID not found in section' });