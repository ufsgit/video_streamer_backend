const express = require('express');
const router = express.Router();
const { updateProgress } = require('./updateProgress.controller');
const { getVideoProgress } = require('../getVideoProgress/getVideoProgress.controller');
const { protect } = require('../../../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/user/videos/progress/{videoId}:
 *   get:
 *     summary: Get user watch progress for a specific video
 *     tags: [User Application]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Video progress retrieved successfully
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
 *                   example: Video progress retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                     video_id:
 *                       type: integer
 *                     current_timestamp_seconds:
 *                       type: integer
 *                     total_video_duration:
 *                       type: integer
 *                     is_completed:
 *                       type: integer
 *                     first_opened_at:
 *                       type: string
 *                       format: date-time
 *                     last_watched_at:
 *                       type: string
 *                       format: date-time
 *                     completed_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
// GET /api/user/videos/progress/:videoId
router.get('/:videoId', protect, getVideoProgress);

/**
 * @swagger
 * /api/user/videos/progress:
 *   post:
 *     summary: Update video watch progress
 *     tags: [User Application]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - video_id
 *             properties:
 *               video_id:
 *                 type: integer
 *               current_timestamp_seconds:
 *                 type: integer
 *               total_video_duration:
 *                 type: integer
 *                 description: Total duration of the video in seconds
 *               total_watch_time_seconds:
 *                 type: integer
 *                 description: Legacy parameter for total video duration (deprecated)
 *               is_completed:
 *                 type: boolean
 *               first_opened_at:
 *                 type: string
 *                 format: date-time
 *                 description: Exact timestamp when video was first opened
 *               last_watched_at:
 *                 type: string
 *                 format: date-time
 *                 description: Exact timestamp of the current progress
 *               completed_at:
 *                 type: string
 *                 format: date-time
 *                 description: Exact timestamp when the video was completed
 *     responses:
 *       200:
 *         description: Video progress updated successfully
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
 *                   example: Video progress updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     first_opened_at:
 *                       type: string
 *                       format: date-time
 *                     last_watched_at:
 *                       type: string
 *                       format: date-time
 *                     completed_at:
 *                       type: string
 *                       format: date-time
 *                     current_timestamp_seconds:
 *                       type: integer
 *                     is_completed:
 *                       type: integer
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
// POST /api/user/videos/progress
router.post('/', protect, updateProgress);

module.exports = router;
