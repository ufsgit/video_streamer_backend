const express = require('express');
const router = express.Router();
const getNotificationsController = require('./getNotifications.controller');
const { protect } = require('../../../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/user/notifications:
 *   get:
 *     summary: Get active notifications for the logged-in user
 *     description: Returns all active notifications set by the user's assigned doctor/admin. Call this on app launch or refresh.
 *     tags: [User Application]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
// GET /api/user/notifications
// Only protect (not adminOnly) — this is for regular users
router.get('/', protect, getNotificationsController.getNotifications);

module.exports = router;
