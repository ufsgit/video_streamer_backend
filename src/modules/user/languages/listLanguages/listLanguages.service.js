const pool = require('../../../../../db');

const listLanguages = async () => {
    const [rows] = await pool.query('CALL get_active_languages()');
    return rows[0]; 
};

module.exports = { listLanguages };
