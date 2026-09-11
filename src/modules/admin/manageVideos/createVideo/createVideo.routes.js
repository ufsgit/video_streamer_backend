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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the video
 *               description:
 *                 type: string
 *                 description: Video description
 *               category:
 *                 type: string
 *                 description: Category of the video
 *               video_url:
 *                 type: string
 *                 description: Optional URL for external videos (e.g., YouTube/Vimeo) if no file uploaded
 *               language_id:
 *                 type: integer
 *                 description: Language ID
 *               language:
 *                 type: string
 *                 description: Language name
 *               total_duration_seconds:
 *                 type: integer
 *                 description: Total duration in seconds
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Thumbnail image file
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Video file (if not providing video_url)
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
