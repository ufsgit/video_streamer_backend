const express = require('express');
const router = express.Router();
const listLanguagesController = require('./listLanguages.controller');
const { protect } = require('../../../../middlewares/auth.middleware');

// Removed adminOnly middleware so users can access this route
router.get('/', protect, listLanguagesController.listLanguages);
module.exports = router;
