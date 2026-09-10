const express = require('express');
const router = express.Router();
const listLanguagesController = require('./listLanguages.controller');

/**
 * @swagger
 * /api/admin/languages/list:
 *   get:
 *     summary: List all languages
 *     tags: [Admin Languages]
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
// GET /api/admin/languages/list
router.get('/', listLanguagesController.listLanguages);

module.exports = router;
