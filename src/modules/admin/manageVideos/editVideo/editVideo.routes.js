const express = require('express');
const router = express.Router();
const editVideoController = require('./editVideo.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');
const { uploadVideoAndThumbnail } = require('../../../../middlewares/upload.middleware');

router.put('/:id', protect, adminOnly, uploadVideoAndThumbnail, editVideoController.editVideo);
module.exports = router;
