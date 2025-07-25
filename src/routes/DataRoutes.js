import express from 'express';
import { addSeedsCategories, deleteCategoryById, getALlData, getAllSeeds, updateCategoryById, getSeedsTypeByID, addSeedsTypeByID, deleteSeedsTypeByID, updateSeedsTypeByID, getSeedsDescreptionById, updateSubCategoryDescription, addSubCategoryDescription, deleteSubCategoryDescriptionById, getAllCommunication, addCommunication, addEngCommunication, getEngCommunicationById, updateCommunication, deleteCommunication, updateEngById, deleteEngById, getmainCat, UpdatemainCat, addmainCat, getInsecticideData, addInsecticideData, deleteInsecticideData, updateInsecticideData, getInsecticideTypes, addInsecticideType, deleteInsecticideType, updateInsecticideType, getFertilizerdata, addFertilizerdata, updateFertilizerdata, deleteFertilizerdata, getFertilizerType, addFertilizerType, updateFertilizerType, deleteFertilizerType, getFertilizerNestedType, addFertilizerNestedType, updateFertilizerNestedType, deleteFertilizerNestedType } from '../controllers/DataControlles.js';
import multer from 'multer';
import { verifyAdminToken } from '../middleware/authMiddleware.js';

const router = express.Router();
// Temporary local storage
const upload = multer({ storage: multer.memoryStorage() });
//mian
router.get("/get-main-categories", getmainCat)
router.post("/add-main-categories", verifyAdminToken, upload.single('image'), addmainCat)
router.post("/update-main-categories", verifyAdminToken, upload.single('image'), UpdatemainCat)
//data
router.get('/get-data', getALlData);
//seeds cat main
router.get('/get-seeds-data', getAllSeeds);
router.post('/add-seeds-categories', verifyAdminToken, upload.single('image'), addSeedsCategories);
router.post('/update-seeds-categories', verifyAdminToken, upload.single('image'), updateCategoryById);
router.delete('/delete-seeds-categories/:id', verifyAdminToken, deleteCategoryById);
//subCat seeds type
router.get('/get-seeds-type/:id', getSeedsTypeByID);
router.post('/add-seeds-type', verifyAdminToken, upload.single('image'), addSeedsTypeByID);
router.delete('/delete-seeds-type/:id', verifyAdminToken, deleteSeedsTypeByID);
router.post('/update-seeds-type', verifyAdminToken, upload.single('image'), updateSeedsTypeByID);
//seeds desc
router.get('/get-seeds-description/:id', getSeedsDescreptionById);
router.post('/add-seeds-description/:id', verifyAdminToken, addSubCategoryDescription); // id = category id
router.put('/update-seeds-description/:id', verifyAdminToken, updateSubCategoryDescription);       // id = subcategory id
router.delete('/delete-seeds-description/:id', verifyAdminToken, deleteSubCategoryDescriptionById);    // id = subcategory id
//Communication
router.get('/get-communication-data', getAllCommunication);
router.post('/add-communication-data', verifyAdminToken, addCommunication);
router.post('/update-communication-data', verifyAdminToken, updateCommunication);
router.delete('/delete-communication-data/:id', verifyAdminToken, deleteCommunication);
//eng
router.get('/get-communication-eng/:id', getEngCommunicationById);
router.post('/add-eng-data', verifyAdminToken, upload.single('image'), addEngCommunication);
router.post('/update-communication-eng/:placeId/:engId', verifyAdminToken, upload.single('image'), updateEngById);
router.delete('/delete-communication-eng/:placeId/:engId', verifyAdminToken, deleteEngById);
//insecticide 
router.get('/get-insecticide-data', getInsecticideData);
router.post('/add-insecticide-data', verifyAdminToken, upload.single('image'), addInsecticideData);
router.delete('/delete-insecticide-data/:id', verifyAdminToken, deleteInsecticideData);
router.post('/update-insecticide-data', verifyAdminToken, upload.single('image'), updateInsecticideData);
//insecticide type
router.get('/get-insecticide-type/:catId', getInsecticideTypes);
router.post('/add-insecticide-type', verifyAdminToken, upload.single('image'), addInsecticideType);
router.post('/update-insecticide-type/:catId/:typeId', verifyAdminToken, upload.single('image'), updateInsecticideType);
router.delete('/delete-insecticide-type/:catId/:typeId', verifyAdminToken, deleteInsecticideType);

//Fertilizer
router.get('/get-fertilizer-data', getFertilizerdata);
router.post('/add-fertilizer-data', verifyAdminToken, upload.single('image'), addFertilizerdata);
router.post('/update-fertilizer-data', verifyAdminToken, upload.single('image'), updateFertilizerdata);
router.delete('/delete-fertilizer-data/:id', verifyAdminToken, deleteFertilizerdata);
//Fertilizer type
router.get('/get-fertilizer-type/:id', getFertilizerType);
router.post('/add-fertilizer-type', verifyAdminToken, upload.single('image'), addFertilizerType); //add type with desc
router.post('/update-fertilizer-type', verifyAdminToken, upload.single('image'), updateFertilizerType);
router.delete('/delete-fertilizer-type/:categoryId/:typeId', verifyAdminToken, deleteFertilizerType);
//Fertilizer type two
router.get('/get-fertilizer-nested-type/:categoryId/:typeId', getFertilizerNestedType);
router.post('/add-fertilizer-nested-type', upload.single('image'), verifyAdminToken, addFertilizerNestedType); //add nested type with desc
router.post('/update-fertilizer-nested-type', upload.single('image'), verifyAdminToken, updateFertilizerNestedType);
router.delete('/delete-fertilizer-nested-type/:categoryId/:typeId/:nestedTypeId', verifyAdminToken, deleteFertilizerNestedType);

export default router;