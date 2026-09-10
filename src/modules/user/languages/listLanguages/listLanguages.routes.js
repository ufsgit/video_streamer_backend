const express = require('express');
const router = express.Router();
const listLanguagesController = require('./listLanguages.controller');
const { protect } = require('../../../../middlewares/auth.middleware');

// Removed adminOnly middleware so users can access this route
/**
 * @swagger
 * /api/user/languages/list:
 *   get:
 *     summary: List available languages
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
router.get('/', protect, listLanguagesController.listLanguages);
module.exports = router;
