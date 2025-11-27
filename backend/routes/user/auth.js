import express from 'express';
import { login, logout, refreshToken, register, resendVerificationEmail, verifyEmail } from '../../controllers/user/auth.js';
import { authenticate } from '../../middleware/auth.js';
const router = express.Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/resend-verify', resendVerificationEmail);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.post('/refresh-token', refreshToken);

export default router;