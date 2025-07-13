import express from 'express';
import { addSeedsCategories, deleteCategoryById, getALlData, getAllSeeds, updateCategoryById ,getSeedsTypeByID, addSeedsTypeByID, deleteSeedsTypeByID, updateSeedsTypeByID, getSeedsDescreptionById, updateSubCategoryDescription, addSubCategoryDescription, deleteSubCategoryDescriptionById} from '../controllers/DataControlles.js';
import multer from 'multer';

const router = express.Router();


// Temporary local storage

const upload = multer({ storage: multer.memoryStorage() });

router.get('/get-data', getALlData);
//seeds cat main
router.get('/get-seeds-data', getAllSeeds);
router.post('/add-seeds-categories', upload.single('image'), addSeedsCategories);
router.delete('/delete-seeds-categories/:id', deleteCategoryById);
router.post('/update-seeds-categories',upload.single('image'), updateCategoryById);
//subCat seeds type
router.get('/get-seeds-type/:id', getSeedsTypeByID);
router.post('/add-seeds-type', addSeedsTypeByID);
router.delete('/delete-seeds-type/:id', deleteSeedsTypeByID);
router.put('/update-seeds-type/:id', updateSeedsTypeByID );
//seeds desc
router.get('/get-seeds-description/:id', getSeedsDescreptionById);
router.post('/add-seeds-description/:id', addSubCategoryDescription); // id = category id
router.put('/update-seeds-description/:id', updateSubCategoryDescription);       // id = subcategory id
router.delete('/delete-seeds-description/:id', deleteSubCategoryDescriptionById);    // id = subcategory id


export default router;