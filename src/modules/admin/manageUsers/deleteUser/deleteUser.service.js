const pool = require('../../../../../db');

const deleteUser = async (userId, doctorId) => {
    await pool.query('CALL user_delete(?, ?)', [userId, doctorId]);
};

module.exports = {
    deleteUser
};
