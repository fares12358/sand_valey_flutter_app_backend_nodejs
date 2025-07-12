import express from 'express';
import { addSeedsCategories, deleteCategoryById, getALlData, getAllSeeds, updateCategoryById } from '../controllers/DataControlles.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();


// Temporary local storage

const upload = multer({ storage: multer.memoryStorage() });

router.get('/get-data', getALlData);
//seeds
router.get('/get-seeds-data', getAllSeeds);
router.post('/add-seeds-categories', upload.single('image'), addSeedsCategories);
router.delete('/delete-seeds-categories/:id', deleteCategoryById);
router.put('/update-seeds-categories', updateCategoryById);


export default router;