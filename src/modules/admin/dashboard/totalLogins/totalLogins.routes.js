const express = require('express');
const router = express.Router();
const totalLoginsController = require('./totalLogins.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/admin/dashboard/total-logins:
 *   get:
 *     summary: Get total logins
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
// GET /api/admin/dashboard/total-logins
// Protected by token verification and admin-only role check
router.get('/', protect, adminOnly, totalLoginsController.getTotalLogins);

module.exports = router;
