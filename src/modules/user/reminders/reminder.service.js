const pool = require('../../../../db');

const saveReminder = async (userId, reminderTime, isEnabled = 0) => {
    const [rows] = await pool.query('CALL save_user_reminder(?, ?, ?)', [
        userId,
        reminderTime,
        isEnabled
    ]);
    return rows[0] && rows[0][0] ? rows[0][0] : null;
};

const getReminder = async (userId) => {
    const [rows] = await pool.query('CALL get_user_reminder(?)', [userId]);
    return rows[0] && rows[0][0] ? rows[0][0] : null;
};

module.exports = {
    saveReminder,
    getReminder
};
