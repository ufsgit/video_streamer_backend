const express = require('express');
const router = express.Router();
const totalLoginsController = require('./totalLogins.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

// GET /api/admin/dashboard/total-logins
// Protected by token verification and admin-only role check
router.get('/', protect, adminOnly, totalLoginsController.getTotalLogins);

module.exports = router;
