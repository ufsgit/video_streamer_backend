const pool = require('../../../../../db');

const getVideoById = async (videoId) => {
    const [rows] = await pool.query('CALL video_getbyid(?)', [videoId]);
    return rows.length > 0 && rows[0].length > 0 ? rows[0][0] : null; 
};

module.exports = { getVideoById };
