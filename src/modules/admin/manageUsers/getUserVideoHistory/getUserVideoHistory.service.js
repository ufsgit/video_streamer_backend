const pool = require('../../../../../db');

const getUserVideoHistory = async (userId, category) => {
    const [rows] = await pool.query('CALL get_user_video_history(?, ?)', [userId, category || null]);
    // SP returns an array of result sets; rows[0] is our video list
    return rows[0]; 
};

module.exports = { getUserVideoHistory };
