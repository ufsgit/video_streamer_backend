const express = require('express');
const router = express.Router();
const listUsersController = require('./listUsers.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

// GET /api/admin/users/list
router.get('/', protect, adminOnly, listUsersController.listUsers);

module.exports = router;
