const express = require('express');
const router = express.Router();
const { listProfiles } = require('./listProfiles.controller');
const { protect } = require('../../../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/user/profiles/list:
 *   get:
 *     summary: Get user profile
 *     tags: [User Application]
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
// GET /api/user/profiles/list
// The 'protect' middleware ensures only a logged-in user can access this, 
// and it automatically populates req.user.id for the controller.
router.get('/', protect, listProfiles);

module.exports = router;
