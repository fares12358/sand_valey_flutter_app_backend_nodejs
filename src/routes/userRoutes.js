import express from 'express';
import { deleteUserById, getALlUsers, getUserById } from '../controllers/UserControlles.js';
const router = express.Router();

router.get('/get-users', getALlUsers); 
router.get('/get-user-by-id/:id', getUserById); 
router.delete('/delete-user-by-id/:id', deleteUserById); 

export default router;
