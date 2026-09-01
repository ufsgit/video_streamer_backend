const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// Public routes (No token required)
router.post('/admin/login', authController.loginAdmin);
router.post('/user/login', authController.loginUser);

module.exports = router;
