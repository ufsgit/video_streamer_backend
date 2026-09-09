const express = require('express');
const router = express.Router();
const listVideosByCategoryController = require('./listVideosByCategory.controller');

// GET /api/user/videos/list?category=pre-op&language_id=1
router.get('/', listVideosByCategoryController.getVideos);

module.exports = router;
