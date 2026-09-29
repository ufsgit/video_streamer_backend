const pool = require('../../../../../db');

const getTopWatchedVideos = async () => {
    const [rows] = await pool.query('CALL dash_get_top_watched_videos()');
    return rows[0]; // Returns array of top 5 videos
};

module.exports = {
    getTopWatchedVideos
};
