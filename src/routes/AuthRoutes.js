import express from 'express';
import { forgotPassword, loginUser, registerUser, resetPassword, updateUser, verifyEmail, verifyOTP, verifyUser } from '../controllers/AuthControlles.js';
import { authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', loginUser);
// POST /api/auth/register
router.post('/register', authorizeRoles('admin'), registerUser); //create new user for data entry 
// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
// POST /api/auth/reset-password
router.post('/reset-password', resetPassword);
// POST /api/auth/logout
router.put('/update-user', updateUser);

router.get('/verify-email/:token', verifyEmail);

router.get('/verify-user/:id', verifyUser);

export default router;
