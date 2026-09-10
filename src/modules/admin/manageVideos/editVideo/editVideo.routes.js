const express = require('express');
const router = express.Router();
const editVideoController = require('./editVideo.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');
const { uploadVideoAndThumbnail } = require('../../../../middlewares/upload.middleware');

/**
 * @swagger
 * /api/admin/videos/edit/{id}:
 *   put:
 *     summary: Edit video details
 *     tags: [Admin Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the resource
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
router.put('/:id', protect, adminOnly, uploadVideoAndThumbnail, editVideoController.editVideo);
module.exports = router;
