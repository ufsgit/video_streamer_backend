const express = require('express');
const router = express.Router();
const createVideoController = require('./createVideo.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');
const { uploadVideoAndThumbnail } = require('../../../../middlewares/upload.middleware');

/**
 * @swagger
 * /api/admin/videos/create:
 *   post:
 *     summary: Create a new video
 *     tags: [Admin Videos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
// POST /api/admin/videos/create
router.post('/', protect, adminOnly, uploadVideoAndThumbnail, createVideoController.createVideo);

module.exports = router;
