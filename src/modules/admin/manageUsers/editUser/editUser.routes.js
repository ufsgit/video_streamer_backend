const express = require('express');
const router = express.Router();
const editUserController = require('./editUser.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');
const { uploadSinglePhoto } = require('../../../../middlewares/upload.middleware');

/**
 * @swagger
 * /api/admin/users/edit/{id}:
 *   put:
 *     summary: Edit user details
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the resource
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
// PUT /api/admin/users/edit/:id
router.put('/:id', protect, adminOnly, uploadSinglePhoto, editUserController.editUser);

module.exports = router;
