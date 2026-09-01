const express = require('express');
const router = express.Router();
const avgVideosController = require('./avgVideosWatched.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

// GET /api/admin/dashboard/avg-videos-watched
router.get('/', protect, adminOnly, avgVideosController.getAvgVideosWatched);

module.exports = router;
