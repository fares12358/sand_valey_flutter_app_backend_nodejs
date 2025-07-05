import express from 'express';
import { getALlData } from '../controllers/DataControlles.js';
const router = express.Router();

router.get('/get-data', getALlData); 

export default router;
