const pool = require('../../../../../db');

const listLanguages = async () => {
    const [rows] = await pool.query('CALL admin_list_languages()');
    return rows[0]; 
};

module.exports = { listLanguages };
