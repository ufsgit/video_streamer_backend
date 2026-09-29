const toggleNotificationService = require('./toggleNotification.service');

const toggleNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        const adminId = req.user.id;

        if (!id || is_active === undefined) {
            return res.status(400).json({ success: false, message: 'Notification ID and is_active are required.' });
        }

        const result = await toggleNotificationService.toggleNotification({
            notificationId: id,
            adminId,
            isActive: is_active
        });

        res.status(200).json({
            success: true,
            message: `Notification ${is_active ? 'activated' : 'deactivated'} successfully`,
            data: result
        });

    } catch (error) {
        console.error('Error toggling notification:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { toggleNotification };
