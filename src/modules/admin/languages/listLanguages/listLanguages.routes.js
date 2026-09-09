const express = require('express');
const router = express.Router();
const listLanguagesController = require('./listLanguages.controller');

// GET /api/admin/languages/list
router.get('/', listLanguagesController.listLanguages);

module.exports = router;
