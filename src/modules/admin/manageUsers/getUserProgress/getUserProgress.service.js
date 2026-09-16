const pool = require('../../../../../db');

const getUserProgress = async (userId, category) => {
    // Pass both parameters to the stored procedure
    const [rows] = await pool.query('CALL get_user_engagement_progress(?, ?)', [userId, category || null]);
    return rows.length > 0 && rows[0].length > 0 ? rows[0][0] : null; 
};

module.exports = {
    getUserProgress
};
