const express = require('express');
const router = express.Router();
const getUserByIdController = require('./getUserById.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

// GET /api/admin/users/get/:id
router.get('/:id', protect, adminOnly, getUserByIdController.getUserById);

module.exports = router;
