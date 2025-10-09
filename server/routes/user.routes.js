const express = require('express');
const { updateProfile, changePassword, getUsers } = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Protected routes
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

// Admin routes
router.get('/', protect, authorize('admin'), getUsers);

module.exports = router;