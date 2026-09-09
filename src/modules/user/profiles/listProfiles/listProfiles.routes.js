const express = require('express');
const router = express.Router();
const { listProfiles } = require('./listProfiles.controller');
const { protect } = require('../../../../middlewares/auth.middleware');

// GET /api/user/profiles/list
// The 'protect' middleware ensures only a logged-in user can access this, 
// and it automatically populates req.user.id for the controller.
router.get('/', protect, listProfiles);

module.exports = router;
