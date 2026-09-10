const express = require('express');
const router = express.Router();
const { checkAppVersion } = require('./checkVersion.controller');

/**
 * @swagger
 * /api/app-version/check:
 *   get:
 *     summary: Check app version
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
router.get('/', checkAppVersion);

module.exports = router;
