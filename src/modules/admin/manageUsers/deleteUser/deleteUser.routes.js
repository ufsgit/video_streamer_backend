const express = require('express');
const router = express.Router();
const deleteUserController = require('./deleteUser.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/admin/users/delete/{id}:
 *   delete:
 *     summary: Delete a user by ID
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
// DELETE /api/admin/users/delete/:id
router.delete('/:id', protect, adminOnly, deleteUserController.deleteUser);

module.exports = router;
