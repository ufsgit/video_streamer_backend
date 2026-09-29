const listNotificationsService = require('./listNotifications.service');

const listNotifications = async (req, res) => {
    try {
        const adminId = req.user.id;

        const notifications = await listNotificationsService.listNotifications({ adminId });

        res.status(200).json({
            success: true,
            data: notifications
        });

    } catch (error) {
        console.error('Error listing notifications:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { listNotifications };
