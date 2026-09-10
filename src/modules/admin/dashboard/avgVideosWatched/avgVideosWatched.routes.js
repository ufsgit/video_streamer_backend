const express = require('express');
const router = express.Router();
const avgVideosController = require('./avgVideosWatched.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/admin/dashboard/avg-videos:
 *   get:
 *     summary: Get average videos watched per user
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
// GET /api/admin/dashboard/avg-videos-watched
router.get('/', protect, adminOnly, avgVideosController.getAvgVideosWatched);

module.exports = router;
