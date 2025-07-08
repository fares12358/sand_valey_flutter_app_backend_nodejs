import express from 'express';
import { getALlUsers, getUserById } from '../controllers/UserControlles.js';
const router = express.Router();

router.get('/get-users', getALlUsers); 
router.get('/get-user-by-id/:id', getUserById); 

export default router;
