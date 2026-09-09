const pool = require('../../../../../db');

const checkVersion = async (current_version, is_admin_update) => {
    // Call the Stored Procedure with the parameters
    const [rows] = await pool.query('CALL check_app_version(?, ?)', [current_version, is_admin_update]);
    return rows[0];
};

module.exports = { checkVersion };
