import express from 'express';
import { addSeedsCategories, deleteCategoryById, getALlData, getAllSeeds, updateCategoryById, getSeedsTypeByID, addSeedsTypeByID, deleteSeedsTypeByID, updateSeedsTypeByID, getSeedsDescreptionById, updateSubCategoryDescription, addSubCategoryDescription, deleteSubCategoryDescriptionById, getAllCommunication, addCommunication, addEngCommunication, getEngCommunicationById, updateCommunication, deleteCommunication, updateEngById, deleteEngById, getmainCat, UpdatemainCat, addmainCat, getInsecticideData, addInsecticideData, deleteInsecticideData, updateInsecticideData, getInsecticideTypes, addInsecticideType, deleteInsecticideType, updateInsecticideType } from '../controllers/DataControlles.js';
import multer from 'multer';

const router = express.Router();
// Temporary local storage
const upload = multer({ storage: multer.memoryStorage() });
//mian
router.get("/get-main-categories", getmainCat)
router.post("/add-main-categories", upload.single('image'), addmainCat)
router.post("/update-main-categories", upload.single('image'), UpdatemainCat)
//data
router.get('/get-data', getALlData);
//seeds cat main
router.get('/get-seeds-data', getAllSeeds);
router.post('/add-seeds-categories', upload.single('image'), addSeedsCategories);
router.delete('/delete-seeds-categories/:id', deleteCategoryById);
router.post('/update-seeds-categories', upload.single('image'), updateCategoryById);
//subCat seeds type
router.get('/get-seeds-type/:id', getSeedsTypeByID);
router.post('/add-seeds-type', upload.single('image'), addSeedsTypeByID);
router.delete('/delete-seeds-type/:id', deleteSeedsTypeByID);
router.post('/update-seeds-type', upload.single('image'), updateSeedsTypeByID);
//seeds desc
router.get('/get-seeds-description/:id', getSeedsDescreptionById);
router.post('/add-seeds-description/:id', addSubCategoryDescription); // id = category id
router.put('/update-seeds-description/:id', updateSubCategoryDescription);       // id = subcategory id
router.delete('/delete-seeds-description/:id', deleteSubCategoryDescriptionById);    // id = subcategory id
//Communication
router.get('/get-communication-data', getAllCommunication);
router.post('/add-communication-data', addCommunication);
router.post('/update-communication-data', updateCommunication);
router.delete('/delete-communication-data/:id', deleteCommunication);
//eng
router.post('/add-eng-data', upload.single('image'), addEngCommunication);
router.get('/get-communication-eng/:id', getEngCommunicationById);
router.post('/update-communication-eng/:placeId/:engId', upload.single('image'), updateEngById);
router.delete('/delete-communication-eng/:placeId/:engId', deleteEngById);
//insecticide 
router.get('/get-insecticide-data', getInsecticideData);
router.post('/add-insecticide-data', upload.single('image'), addInsecticideData);
router.delete('/delete-insecticide-data/:id', deleteInsecticideData);
router.post('/update-insecticide-data', upload.single('image'), updateInsecticideData);
//insecticide type
router.get('/get-insecticide-type/:catId', getInsecticideTypes);
router.post('/add-insecticide-type', upload.single('image'), addInsecticideType);
router.post('/update-insecticide-type/:catId/:typeId', upload.single('image'), updateInsecticideType);
router.delete('/delete-insecticide-type/:catId/:typeId', deleteInsecticideType);


export default router;