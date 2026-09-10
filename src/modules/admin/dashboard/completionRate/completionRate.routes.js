const express = require('express');
const router = express.Router();
const completionRateController = require('./completionRate.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/admin/dashboard/completion-rate:
 *   get:
 *     summary: Get overall video completion rate
 *     tags: [Admin Dashboard]
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
// GET /api/admin/dashboard/completion-rate
router.get('/', protect, adminOnly, completionRateController.getCompletionRate);

module.exports = router;
