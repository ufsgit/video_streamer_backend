const reminderService = require('./reminder.service');

const saveReminderController = async (req, res, next) => {
    try {
        const { user_id, reminder_time, is_enabled } = req.body;

        if (!user_id || !reminder_time) {
            return res.status(400).json({
                success: false,
                message: 'user_id and reminder_time (HH:MM:SS) are required'
            });
        }

        const data = await reminderService.saveReminder(
            user_id,
            reminder_time,
            is_enabled !== undefined ? is_enabled : 0
        );

        res.status(200).json({
            success: true,
            message: 'Reminder saved successfully',
            data
        });
    } catch (error) {
        next(error);
    }
};

const getReminderController = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'userId parameter is required'
            });
        }

        const data = await reminderService.getReminder(userId);

        res.status(200).json({
            success: true,
            data: data || null
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    saveReminderController,
    getReminderController
};
