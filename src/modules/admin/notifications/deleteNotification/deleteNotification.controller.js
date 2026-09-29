const deleteNotificationService = require('./deleteNotification.service');

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;

        if (!id) {
            return res.status(400).json({ success: false, message: 'Notification ID is required.' });
        }

        const result = await deleteNotificationService.deleteNotification({
            notificationId: id,
            adminId
        });

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully',
            data: result
        });

    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { deleteNotification };
