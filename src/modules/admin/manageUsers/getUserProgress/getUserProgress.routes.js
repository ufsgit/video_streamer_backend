const express = require('express');
const router = express.Router();
const getUserProgressController = require('./getUserProgress.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/admin/users/progress/{id}:
 *   get:
 *     summary: Get user engagement progress with category filter
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
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *           enum: [all, pre-op, post-op]
 *         description: Optional category to filter progress (all, pre-op, or post-op)
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
// GET /api/admin/users/progress/:id
router.get('/:id', protect, adminOnly, getUserProgressController.getUserProgress);

module.exports = router;
