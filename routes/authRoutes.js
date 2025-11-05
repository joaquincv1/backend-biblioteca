const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// /api/auth/register
router.post('/register', userController.registerUser);

// /api/auth/login
router.post('/login', userController.loginUser);

// /api/auth/profile
// (Esta la protegeremos en el siguiente paso)
router.get('/profile', userController.getUserProfile);

module.exports = router;