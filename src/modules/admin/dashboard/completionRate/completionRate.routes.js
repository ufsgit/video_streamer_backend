const express = require('express');
const router = express.Router();
const completionRateController = require('./completionRate.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

// GET /api/admin/dashboard/completion-rate
router.get('/', protect, adminOnly, completionRateController.getCompletionRate);

module.exports = router;
