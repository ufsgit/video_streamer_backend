const pool = require('../../../../../db');

const getTotalLogins = async () => {
    const [rows] = await pool.query('CALL dash_get_total_logins()');
    return rows[0][0]; // Extracting the single row from the first result set
};

module.exports = {
    getTotalLogins
};
