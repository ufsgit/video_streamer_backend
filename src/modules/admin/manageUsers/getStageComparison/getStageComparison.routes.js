const express = require('express');
const router = express.Router();
const getStageComparisonController = require('./getStageComparison.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/admin/users/stage-comparison/{userId}:
 *   get:
 *     summary: Fetch Pre-Op and Post-Op comparison metrics, watch time, and durations for UI card
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient User ID
 *     responses:
 *       200:
 *         description: Pre-Op & Post-Op comparison metrics with formatted watch times and stage effort share
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Server error
 */
router.get('/:userId', protect, adminOnly, getStageComparisonController.getStageComparison);
router.get('/', protect, adminOnly, getStageComparisonController.getStageComparison);

module.exports = router;
