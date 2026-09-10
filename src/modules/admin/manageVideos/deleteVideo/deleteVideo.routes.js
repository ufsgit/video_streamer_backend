const express = require('express');
const router = express.Router();
const deleteVideoController = require('./deleteVideo.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/admin/videos/delete/{id}:
 *   delete:
 *     summary: Delete a video by ID
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
router.delete('/:id', protect, adminOnly, deleteVideoController.deleteVideo);
module.exports = router;
