const pool = require('../../../../../db');

const getUserEngagement = async (userId, languageId) => {
    const [rows] = await pool.query('CALL user_get_engagement(?, ?)', [userId, languageId || null]);
    return rows.length > 0 && rows[0].length > 0 ? rows[0][0] : null; 
};

module.exports = {
    getUserEngagement
};
