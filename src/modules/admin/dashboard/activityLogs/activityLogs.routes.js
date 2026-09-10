const express = require('express');
const router = express.Router();
const activityLogsController = require('./activityLogs.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/admin/dashboard/activity-logs:
 *   get:
 *     summary: Get recent activity logs
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
// GET /api/admin/dashboard/activity-logs
router.get('/', protect, adminOnly, activityLogsController.getActivityLogs);

module.exports = router;
