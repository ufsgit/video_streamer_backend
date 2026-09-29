const pool = require('../../../../../db');

const listNotifications = async ({ adminId }) => {
    const [rows] = await pool.query(
        'CALL admin_notification_list(?)',
        [adminId]
    );
    return rows[0];
};

module.exports = { listNotifications };
