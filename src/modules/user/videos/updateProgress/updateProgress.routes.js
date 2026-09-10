const express = require('express');
const router = express.Router();
const { updateProgress } = require('./updateProgress.controller');
const { protect } = require('../../../../middlewares/auth.middleware');

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
 *               total_watch_time_seconds:
 *                 type: integer
 *               is_completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Video progress updated successfully
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
