const express = require('express');
const router = express.Router();
const { listAdmins } = require('./listAdmins.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/admin/admins/list:
 *   get:
 *     summary: List all admins
 *     tags: [Admin Users]
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
// GET /api/admin/admins/list
// Only an authenticated admin can view the list of admins
router.get('/', protect, adminOnly, listAdmins);

module.exports = router;
