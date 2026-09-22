const express = require('express');
const router = express.Router();
const reminderController = require('./reminder.controller');

router.post('/save', reminderController.saveReminderController);
router.get('/:userId', reminderController.getReminderController);

module.exports = router;
