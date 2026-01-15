const express = require('express');
const { 
  register, 
  login, 
  verifyOTP, 
  resendOTP, 
  refreshToken, 
  logout 
} = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', auth, logout);

module.exports = router;
