const pool = require('../../../../../db');

const createNotification = async ({ adminId, title, message, scheduleTime }) => {
    const [rows] = await pool.query(
        'CALL admin_notification_create(?, ?, ?, ?)',
        [adminId, title, message, scheduleTime || null]
    );
    return rows[0][0];
};

module.exports = { createNotification };
