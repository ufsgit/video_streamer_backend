const express = require('express');
const router = express.Router();
const editUserController = require('./editUser.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');
const { uploadSinglePhoto } = require('../../../../middlewares/upload.middleware');

// PUT /api/admin/users/edit/:id
router.put('/:id', protect, adminOnly, uploadSinglePhoto, editUserController.editUser);

module.exports = router;
