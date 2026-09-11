const express = require('express');
const router = express.Router();
const getUserEngagementController = require('./getUserEngagement.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/admin/users/engagement/{id}:
 *   get:
 *     summary: Get user engagement metrics
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: query
 *         name: language_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Optional language ID to filter total assigned videos
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
// GET /api/admin/users/engagement/:id
router.get('/:id', protect, adminOnly, getUserEngagementController.getUserEngagement);

module.exports = router;
