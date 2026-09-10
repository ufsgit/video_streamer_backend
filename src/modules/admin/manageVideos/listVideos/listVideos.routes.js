const express = require('express');
const router = express.Router();
const listVideosController = require('./listVideos.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/admin/videos/list:
 *   get:
 *     summary: List all videos
 *     tags: [Admin Videos]
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
router.get('/', protect, adminOnly, listVideosController.listVideos);
module.exports = router;
