import express from 'express';
import { addSeedsCategories, deleteCategoryById, getALlData, getAllSeeds, updateCategoryById, getSeedsTypeByID, addSeedsTypeByID, deleteSeedsTypeByID, updateSeedsTypeByID, getSeedsDescreptionById, updateSubCategoryDescription, addSubCategoryDescription, deleteSubCategoryDescriptionById, getAllCommunication, addCommunication, addEngCommunication, getEngCommunicationById, updateCommunication, deleteCommunication, updateEngById, deleteEngById, getmainCat, UpdatemainCat, addmainCat, getInsecticideData, addInsecticideData, deleteInsecticideData, updateInsecticideData, getInsecticideTypes, addInsecticideType, deleteInsecticideType, updateInsecticideType, getFertilizerdata, addFertilizerdata, updateFertilizerdata, deleteFertilizerdata, getFertilizerType, addFertilizerType, updateFertilizerType, deleteFertilizerType, getFertilizerNestedType, addFertilizerNestedType, updateFertilizerNestedType, deleteFertilizerNestedType } from '../controllers/DataControlles.js';
import multer from 'multer';
import { authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();
// Temporary local storage
const upload = multer({ storage: multer.memoryStorage() });
//mian
router.get("/get-main-categories", getmainCat)
router.post("/add-main-categories", authorizeRoles('admin','user'), upload.single('image'), addmainCat)
router.post("/update-main-categories", authorizeRoles('admin','user'), upload.single('image'), UpdatemainCat)
//data
router.get('/get-data', getALlData);
//seeds cat main
router.get('/get-seeds-data', getAllSeeds);
router.post('/add-seeds-categories', authorizeRoles('admin','user'), upload.single('image'), addSeedsCategories);
router.delete('/delete-seeds-categories/:id', authorizeRoles('admin','user'), deleteCategoryById);
router.post('/update-seeds-categories', authorizeRoles('admin','user'), upload.single('image'), updateCategoryById);
//subCat seeds type
router.get('/get-seeds-type/:id', getSeedsTypeByID);
router.post('/add-seeds-type', authorizeRoles('admin','user'), upload.single('image'), addSeedsTypeByID);
router.delete('/delete-seeds-type/:id', authorizeRoles('admin','user'), deleteSeedsTypeByID);
router.post('/update-seeds-type', authorizeRoles('admin','user'), upload.single('image'), updateSeedsTypeByID);
//seeds desc
router.get('/get-seeds-description/:id', getSeedsDescreptionById);
router.post('/add-seeds-description/:id', authorizeRoles('admin','user'), addSubCategoryDescription); // id = category id
router.put('/update-seeds-description/:id', authorizeRoles('admin','user'), updateSubCategoryDescription);       // id = subcategory id
router.delete('/delete-seeds-description/:id', authorizeRoles('admin','user'), deleteSubCategoryDescriptionById);    // id = subcategory id
//Communication
router.get('/get-communication-data', getAllCommunication);
router.post('/add-communication-data', authorizeRoles('admin','user'), addCommunication);
router.post('/update-communication-data', authorizeRoles('admin','user'), updateCommunication);
router.delete('/delete-communication-data/:id', authorizeRoles('admin','user'), deleteCommunication);
//eng
router.get('/get-communication-eng/:id', getEngCommunicationById);
router.post('/add-eng-data', authorizeRoles('admin','user'), upload.single('image'), addEngCommunication);
router.post('/update-communication-eng/:placeId/:engId', authorizeRoles('admin','user'), upload.single('image'), updateEngById);
router.delete('/delete-communication-eng/:placeId/:engId', authorizeRoles('admin','user'), deleteEngById);
//insecticide 
router.get('/get-insecticide-data', getInsecticideData);
router.post('/add-insecticide-data', authorizeRoles('admin','user'), upload.single('image'), addInsecticideData);
router.post('/update-insecticide-data', authorizeRoles('admin','user'), upload.single('image'), updateInsecticideData);
router.delete('/delete-insecticide-data/:id', authorizeRoles('admin','user'), deleteInsecticideData);
//insecticide type
router.get('/get-insecticide-type/:catId', getInsecticideTypes);
router.post('/add-insecticide-type', authorizeRoles('admin','user'), upload.single('image'), addInsecticideType);
router.post('/update-insecticide-type/:catId/:typeId', authorizeRoles('admin','user'), upload.single('image'), updateInsecticideType);
router.delete('/delete-insecticide-type/:catId/:typeId', authorizeRoles('admin','user'), deleteInsecticideType);

//Fertilizer
router.get('/get-fertilizer-data', getFertilizerdata);
router.post('/add-fertilizer-data', authorizeRoles('admin','user'), upload.single('image'), addFertilizerdata);
router.post('/update-fertilizer-data', authorizeRoles('admin','user'), upload.single('image'), updateFertilizerdata);
router.delete('/delete-fertilizer-data/:id', authorizeRoles('admin','user'), deleteFertilizerdata);
//Fertilizer type
router.get('/get-fertilizer-type/:id', getFertilizerType);
router.post('/add-fertilizer-type', authorizeRoles('admin','user'), upload.single('image'), addFertilizerType); //add type with desc
router.post('/update-fertilizer-type', authorizeRoles('admin','user'), upload.single('image'), updateFertilizerType);
router.delete('/delete-fertilizer-type/:categoryId/:typeId', authorizeRoles('admin','user'), deleteFertilizerType);
//Fertilizer type two
router.get('/get-fertilizer-nested-type/:categoryId/:typeId', getFertilizerNestedType);
router.post('/add-fertilizer-nested-type', authorizeRoles('admin','user'), upload.single('image'), addFertilizerNestedType); //add nested type with desc
router.post('/update-fertilizer-nested-type', authorizeRoles('admin','user'), upload.single('image'), updateFertilizerNestedType);
router.delete('/delete-fertilizer-nested-type/:categoryId/:typeId/:nestedTypeId', authorizeRoles('admin','user'), deleteFertilizerNestedType);

export default router;