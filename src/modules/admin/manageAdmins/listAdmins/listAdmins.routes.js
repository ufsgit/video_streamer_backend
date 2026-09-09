const express = require('express');
const router = express.Router();
const { listAdmins } = require('./listAdmins.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

// GET /api/admin/admins/list
// Only an authenticated admin can view the list of admins
router.get('/', protect, adminOnly, listAdmins);

module.exports = router;
