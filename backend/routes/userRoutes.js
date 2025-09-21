const express = require('express');
const router = express.Router();
const {
  logoutUser,
  getUserProfile,
  updateImage,
  sendOtpForPasswordReset,
  verifyOtpAndResetPassword,
  loginUser,
  registerUser,
  getUserDashboard
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const {upload}= require("../middlewares/multer")

// Authenticated routes
router.post('/register',  registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getUserProfile);
router.get("/dashboard", protect, getUserDashboard);
router.post('/forgot-password', sendOtpForPasswordReset);
router.post('/reset-password', verifyOtpAndResetPassword);
router.put('/profileImage', protect, upload.single("avatar"), updateImage);


module.exports = router;
