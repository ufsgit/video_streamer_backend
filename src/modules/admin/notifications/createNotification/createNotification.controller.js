const createNotificationService = require('./createNotification.service');

const createNotification = async (req, res) => {
    try {
        const { title, message, schedule_time } = req.body;
        const adminId = req.user.id;

        if (!title || !message) {
            return res.status(400).json({ success: false, message: 'Title and message are required.' });
        }

        const result = await createNotificationService.createNotification({
            adminId,
            title,
            message,
            scheduleTime: schedule_time || null
        });

        res.status(201).json({
            success: true,
            message: 'Notification created successfully',
            data: result
        });

    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { createNotification };
