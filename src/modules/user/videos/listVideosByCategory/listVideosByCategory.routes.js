const express = require('express');
const router = express.Router();
const listVideosByCategoryController = require('./listVideosByCategory.controller');

/**
 * @swagger
 * /api/user/videos/list:
 *   get:
 *     summary: List videos by category
 *     tags: [User Application]
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
// GET /api/user/videos/list?category=pre-op&language_id=1
router.get('/', listVideosByCategoryController.getVideos);

module.exports = router;
