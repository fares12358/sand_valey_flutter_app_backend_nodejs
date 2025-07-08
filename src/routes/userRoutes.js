import express from 'express';
import { getALlUsers } from '../controllers/UserControlles.js';
const router = express.Router();

router.get('/get-users', getALlUsers); 

export default router;
