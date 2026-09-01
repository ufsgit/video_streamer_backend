const pool = require('../../../../../db');

const listUsers = async (doctorId, limit, offset, dateFrom, dateTo, searchQuery) => {
    const [rows] = await pool.query(
        'CALL user_lists(?, ?, ?, ?, ?, ?)', 
        [doctorId, limit, offset, dateFrom, dateTo, searchQuery]
    );
    return rows[0]; 
};

module.exports = {
    listUsers
};
