const express = require('express');
const router = express.Router();
const createVideoController = require('./createVideo.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');
const { uploadVideoAndThumbnail } = require('../../../../middlewares/upload.middleware');

// POST /api/admin/videos/create
router.post('/', protect, adminOnly, uploadVideoAndThumbnail, createVideoController.createVideo);

module.exports = router;
