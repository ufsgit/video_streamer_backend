const getNotificationsService = require('./getNotifications.service');

const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from JWT token by protect middleware
        const data = await getNotificationsService.getNotifications(userId);
        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error('Error fetching user notifications:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getNotifications
};
