const express = require('express');
const router = express.Router();
const updateLanguageController = require('./updateLanguage.controller');
const { protect } = require('../../../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/user/profiles/language:
 *   put:
 *     summary: Update the logged-in user's language
 *     tags: [User Application]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - language_id
 *               - language_name
 *             properties:
 *               language_id:
 *                 type: integer
 *               language_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User language updated successfully.
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
// PUT /api/user/profiles/language
router.put('/', protect, updateLanguageController.updateLanguage);

module.exports = router;
