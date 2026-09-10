const express = require('express');
const router = express.Router();
const { getProfile } = require('./getProfile.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/admin/profile:
 *   get:
 *     summary: Get admin profile details
 *     tags: [Admin Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Admin profile not found
 *       500:
 *         description: Internal server error
 */
router.get('/', protect, adminOnly, getProfile);

module.exports = router;
