const pool = require('../../../../../db');

const getActivityLogs = async () => {
    const [rows] = await pool.query('CALL sp_get_activity_logs()');
    return rows[0]; // Returns the array of the 5 users
};

module.exports = {
    getActivityLogs
};
