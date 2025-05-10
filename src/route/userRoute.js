const express = require('express');
const { registerUser, loginUser, forgetPassword, verifyOtpAndResetPassword } = require('../controller/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgetPassword);
router.post('/reset-password', verifyOtpAndResetPassword);


module.exports = router;