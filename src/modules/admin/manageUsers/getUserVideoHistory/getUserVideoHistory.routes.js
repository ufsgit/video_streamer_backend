const express = require('express');
const router = express.Router();
const getUserVideoHistoryController = require('./getUserVideoHistory.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/admin/users/history/{id}:
 *   get:
 *     summary: Get assigned and watched video history with category filter
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *           enum: [all, pre-op, post-op]
 *     responses:
 *       200:
 *         description: Successful operation
 */
router.get('/:id', protect, adminOnly, getUserVideoHistoryController.getUserVideoHistory);

module.exports = router;
