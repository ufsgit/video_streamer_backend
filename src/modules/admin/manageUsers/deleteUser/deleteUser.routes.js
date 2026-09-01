const express = require('express');
const router = express.Router();
const deleteUserController = require('./deleteUser.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

// DELETE /api/admin/users/delete/:id
router.delete('/:id', protect, adminOnly, deleteUserController.deleteUser);

module.exports = router;
