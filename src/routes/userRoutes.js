import express from 'express';
import { deleteUserById, getALlUsers, getUserById } from '../controllers/UserControlles.js';
import { authorizeRoles } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/get-users', authorizeRoles('admin'), getALlUsers);
router.get('/get-user-by-id/:id', authorizeRoles('admin'), getUserById);
router.delete('/delete-user-by-id/:id', authorizeRoles('admin'), deleteUserById);

export default router;
