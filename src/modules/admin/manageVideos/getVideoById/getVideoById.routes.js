const express = require('express');
const router = express.Router();
const getVideoByIdController = require('./getVideoById.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

router.get('/:id', protect, adminOnly, getVideoByIdController.getVideoById);
module.exports = router;
