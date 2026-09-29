const pool = require('../../../../../db');

const getNotifications = async (userId) => {
    const [rows] = await pool.query('CALL user_get_notifications(?)', [userId]);
    return rows[0]; // Returns array of active notifications for this user
};

module.exports = {
    getNotifications
};
