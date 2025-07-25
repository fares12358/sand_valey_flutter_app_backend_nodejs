import express from 'express';
import { deleteUserById, getALlUsers, getUserById } from '../controllers/UserControlles.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/get-users', verifyAdminToken, getALlUsers);
router.get('/get-user-by-id/:id', verifyAdminToken, getUserById);
router.delete('/delete-user-by-id/:id', verifyAdminToken, deleteUserById);

export default router;
