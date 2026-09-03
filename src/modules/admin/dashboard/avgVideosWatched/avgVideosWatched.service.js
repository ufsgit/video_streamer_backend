const pool = require('../../../../../db');

const getAvgVideosWatched = async () => {
    const [rows] = await pool.query('CALL dash_get_avg_videos()');
    return rows[0][0]; 
};

module.exports = {
    getAvgVideosWatched
};
