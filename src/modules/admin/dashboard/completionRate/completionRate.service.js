const pool = require('../../../../../db');

const getCompletionRate = async () => {
    const [rows] = await pool.query('CALL sp_get_completion_rate()');
    return rows[0][0]; 
};

module.exports = {
    getCompletionRate
};
