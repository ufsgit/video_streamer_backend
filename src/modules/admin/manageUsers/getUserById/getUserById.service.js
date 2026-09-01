const pool = require('../../../../../db');

const getUserById = async (userId, doctorId) => {
    const [rows] = await pool.query('CALL user_getbyid(?, ?)', [userId, doctorId]);
    return rows.length > 0 && rows[0].length > 0 ? rows[0][0] : null; 
};

module.exports = {
    getUserById
};
