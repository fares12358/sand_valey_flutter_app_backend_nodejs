import express from 'express';
import { addSeedsCategories, deleteCategoryById, getALlData, getAllSeeds, updateCategoryById, getSeedsTypeByID, addSeedsTypeByID, deleteSeedsTypeByID, updateSeedsTypeByID, getSeedsDescreptionById, updateSubCategoryDescription, addSubCategoryDescription, deleteSubCategoryDescriptionById, getAllCommunication, addCommunication, addEngCommunication, getEngCommunicationById, updateCommunication, deleteCommunication, updateEngById, deleteEngById, getmainCat, UpdatemainCat, addmainCat, getInsecticideData, addInsecticideData, deleteInsecticideData, updateInsecticideData, getInsecticideTypes, addInsecticideType, deleteInsecticideType, updateInsecticideType, getFertilizerdata, addFertilizerdata, updateFertilizerdata, deleteFertilizerdata, getFertilizerType, addFertilizerType, updateFertilizerType, deleteFertilizerType, getFertilizerNestedType, addFertilizerNestedType, updateFertilizerNestedType, deleteFertilizerNestedType } from '../controllers/DataControlles.js';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
// Temporary local storage
const upload = multer({ storage: multer.memoryStorage() });
//mian
router.get("/get-main-categories", getmainCat);
router.post("/add-main-categories",protect, upload.single('image'), addmainCat);
router.post("/update-main-categories",protect, upload.single('image'), UpdatemainCat);
//data
router.get('/get-data', getALlData);
//seeds cat main
router.get('/get-seeds-data', getAllSeeds);
router.post('/add-seeds-categories', protect, upload.single('image'), addSeedsCategories);
router.delete('/delete-seeds-categories/:id', protect, deleteCategoryById);
router.post('/update-seeds-categories', protect, upload.single('image'), updateCategoryById);
//subCat seeds type
router.get('/get-seeds-type/:id', getSeedsTypeByID);
router.post('/add-seeds-type', protect, upload.single('image'), addSeedsTypeByID);
router.delete('/delete-seeds-type/:id', protect, deleteSeedsTypeByID);
router.post('/update-seeds-type', protect, upload.single('image'), updateSeedsTypeByID);
//seeds desc
router.get('/get-seeds-description/:id', getSeedsDescreptionById);
router.post('/add-seeds-description/:id', protect, addSubCategoryDescription); // id = category id
router.put('/update-seeds-description/:id', protect, updateSubCategoryDescription);       // id = subcategory id
router.delete('/delete-seeds-description/:id', protect, deleteSubCategoryDescriptionById);    // id = subcategory id
//Communication
router.get('/get-communication-data', getAllCommunication);
router.post('/add-communication-data', protect, addCommunication);
router.post('/update-communication-data', protect, updateCommunication);
router.delete('/delete-communication-data/:id', protect, deleteCommunication);
//eng
router.get('/get-communication-eng/:id', getEngCommunicationById);
router.post('/add-eng-data', protect, upload.single('image'), addEngCommunication);
router.post('/update-communication-eng/:placeId/:engId', protect, upload.single('image'), updateEngById);
router.delete('/delete-communication-eng/:placeId/:engId', protect, deleteEngById);
//insecticide 
router.get('/get-insecticide-data', getInsecticideData);
router.post('/add-insecticide-data', protect, upload.single('image'), addInsecticideData);
router.delete('/delete-insecticide-data/:id', protect, deleteInsecticideData);
router.post('/update-insecticide-data', protect, upload.single('image'), updateInsecticideData);
//insecticide type
router.get('/get-insecticide-type/:catId', getInsecticideTypes);
router.post('/add-insecticide-type', protect, upload.single('image'), addInsecticideType);
router.post('/update-insecticide-type/:catId/:typeId', protect, upload.single('image'), updateInsecticideType);
router.delete('/delete-insecticide-type/:catId/:typeId', protect, deleteInsecticideType);

//Fertilizer
router.get('/get-fertilizer-data', getFertilizerdata);
router.post('/add-fertilizer-data', protect, upload.single('image'), addFertilizerdata);
router.post('/update-fertilizer-data', protect, upload.single('image'), updateFertilizerdata);
router.delete('/delete-fertilizer-data/:id', protect, deleteFertilizerdata);
//Fertilizer type
router.get('/get-fertilizer-type/:id', getFertilizerType);
router.post('/add-fertilizer-type', protect, upload.single('image'), addFertilizerType); //add type with desc
router.post('/update-fertilizer-type', protect, upload.single('image'), updateFertilizerType);
router.delete('/delete-fertilizer-type/:categoryId/:typeId', protect, deleteFertilizerType);
//Fertilizer type two
router.get('/get-fertilizer-nested-type/:categoryId/:typeId', getFertilizerNestedType);
router.post('/add-fertilizer-nested-type', protect, upload.single('image'), addFertilizerNestedType); //add nested type with desc
router.post('/update-fertilizer-nested-type', protect, upload.single('image'), updateFertilizerNestedType);
router.delete('/delete-fertilizer-nested-type/:categoryId/:typeId/:nestedTypeId', protect, deleteFertilizerNestedType);

export default router;