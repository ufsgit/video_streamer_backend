const express = require('express');
const router = express.Router();
const { checkAppVersion } = require('./checkVersion.controller');

router.get('/', checkAppVersion);

module.exports = router;
