const pool = require('../../../../../db');

const listVideos = async (adminId, limit, offset, category, source, search) => {
    const [rows] = await pool.query(
        'CALL video_lists(?, ?, ?, ?, ?, ?)',
        [adminId, limit, offset, category, source, search]
    );
    return rows[0]; 
};

module.exports = { listVideos };
