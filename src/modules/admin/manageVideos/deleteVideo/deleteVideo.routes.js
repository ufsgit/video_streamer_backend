const express = require('express');
const router = express.Router();
const deleteVideoController = require('./deleteVideo.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

router.delete('/:id', protect, adminOnly, deleteVideoController.deleteVideo);
module.exports = router;
