const express = require('express');
const router = express.Router();
const topWatchedVideosController = require('./topWatchedVideos.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/admin/dashboard/top-watched-videos:
 *   get:
 *     summary: Get top 5 most watched videos
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
// GET /api/admin/dashboard/top-watched-videos
// Protected by token verification and admin-only role check
router.get('/', protect, adminOnly, topWatchedVideosController.getTopWatchedVideos);

module.exports = router;
