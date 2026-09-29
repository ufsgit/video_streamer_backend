const pool = require('../../../../../db');

const deleteNotification = async ({ notificationId, adminId }) => {
    const [rows] = await pool.query(
        'CALL admin_notification_delete(?, ?)',
        [notificationId, adminId]
    );
    return rows[0][0];
};

module.exports = { deleteNotification };
