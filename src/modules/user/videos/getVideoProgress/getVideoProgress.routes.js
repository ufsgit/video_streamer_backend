const express = require('express');
const router = express.Router();
const { getVideoProgress } = require('./getVideoProgress.controller');
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
router.get('/:videoId', protect, getVideoProgress);

module.exports = router;
