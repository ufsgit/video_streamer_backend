const express = require('express');
const router = express.Router();
const activityController = require('./activity.controller');
const { protect } = require('../../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/user/activity/sync:
 *   post:
 *     summary: Sync user activity, streak, and platform time (app open / heartbeat)
 *     description: Call this endpoint when the user opens the app, periodically during usage (heartbeat), or when syncing platform time. Updates last_active_date to today, increments or sets total platform time, and calculates current streak based on consecutive day logic.
 *     tags: [User Application]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               time_spent_seconds:
 *                 type: integer
 *                 description: Additional seconds spent on platform to add to total time (e.g. 30, 60).
 *                 example: 60
 *               total_time_seconds:
 *                 type: integer
 *                 description: Absolute total seconds on platform (overrides running total if provided).
 *                 example: 3600
 *     responses:
 *       200:
 *         description: Activity synchronized successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User activity synchronized successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     name:
 *                       type: string
 *                     current_streak:
 *                       type: integer
 *                       example: 5
 *                     last_active_date:
 *                       type: string
 *                       example: "2026-09-23"
 *                     total_time_on_platform_seconds:
 *                       type: integer
 *                       example: 7200
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/sync', protect, activityController.syncActivity);

// Also provide /heartbeat and /open aliases for developer convenience
router.post('/heartbeat', protect, activityController.syncActivity);
router.post('/open', protect, activityController.syncActivity);

/**
 * @swagger
 * /api/user/activity:
 *   get:
 *     summary: Get current user activity, streak, and total time on platform
 *     description: Returns the user's current streak, last active date, and total time. If the user has been inactive for > 24 hours, the streak is automatically reset to 0.
 *     tags: [User Application]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activity retrieved successfully.
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', protect, activityController.getActivity);

/**
 * @swagger
 * /api/user/activity/refresh-inactive:
 *   post:
 *     summary: Refresh streaks for all users inactive for > 24 hours
 *     description: Resets current_streak to 0 for all users who missed more than 1 day of activity.
 *     tags: [User Application]
 *     responses:
 *       200:
 *         description: Streaks refreshed.
 *       500:
 *         description: Internal server error
 */
router.post('/refresh-inactive', activityController.refreshInactiveStreaks);

module.exports = router;
