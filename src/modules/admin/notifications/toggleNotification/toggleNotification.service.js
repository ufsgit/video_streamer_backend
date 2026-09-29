const pool = require('../../../../../db');

const toggleNotification = async ({ notificationId, adminId, isActive }) => {
    const [rows] = await pool.query(
        'CALL admin_notification_toggle(?, ?, ?)',
        [notificationId, adminId, isActive]
    );
    return rows[0][0];
};

module.exports = { toggleNotification };
