const express = require('express');
const router = express.Router();
const createUserController = require('./createUser.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');
const { uploadSinglePhoto } = require('../../../../middlewares/upload.middleware');

// POST /api/admin/users/create
router.post('/', protect, adminOnly, uploadSinglePhoto, createUserController.createUser);

module.exports = router;
