const express = require('express');
const router = express.Router();
const activityLogsController = require('./activityLogs.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

// GET /api/admin/dashboard/activity-logs
router.get('/', protect, adminOnly, activityLogsController.getActivityLogs);

module.exports = router;
