import express from 'express';
import { addSeedsCategories, deleteCategoryById, getALlData, getAllSeeds, updateCategoryById ,getSeedsTypeByID, addSeedsTypeByID, deleteSeedsTypeByID, updateSeedsTypeByID} from '../controllers/DataControlles.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();


// Temporary local storage

const upload = multer({ storage: multer.memoryStorage() });

router.get('/get-data', getALlData);
//seeds cat
router.get('/get-seeds-data', getAllSeeds);
router.post('/add-seeds-categories', upload.single('image'), addSeedsCategories);
router.delete('/delete-seeds-categories/:id', deleteCategoryById);
router.post('/update-seeds-categories',upload.single('image'), updateCategoryById);
//subCat seeds
router.get('/get-seeds-type/:id', getSeedsTypeByID);
router.post('/add-seeds-type', addSeedsTypeByID);
router.delete('/delete-seeds-type/:id', deleteSeedsTypeByID);
router.put('/update-seeds-type/:id', updateSeedsTypeByID );
//seeds desc


export default router;