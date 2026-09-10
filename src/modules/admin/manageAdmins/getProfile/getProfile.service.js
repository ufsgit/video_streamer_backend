const pool = require('../../../../../db');

const getAdminProfile = async (adminId) => {
    const [rows] = await pool.query('CALL get_admin_profile(?)', [adminId]);
    return rows[0][0]; 
};

module.exports = { getAdminProfile };
