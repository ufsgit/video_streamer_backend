const express = require('express');
const router = express.Router();
const listVideosController = require('./listVideos.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

router.get('/', protect, adminOnly, listVideosController.listVideos);
module.exports = router;
