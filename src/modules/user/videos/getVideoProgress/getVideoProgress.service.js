const pool = require('../../../../../db');

const getVideoProgress = async (userId, videoId) => {
    const [rows] = await pool.query('CALL get_user_video_progress_by_id(?, ?)', [userId, videoId]);
    
    if (rows && rows[0] && rows[0].length > 0) {
        return rows[0][0];
    }

    // Default progress if the user hasn't watched/opened this video yet
    return {
        user_id: Number(userId),
        video_id: Number(videoId),
        current_timestamp_seconds: 0,
        total_video_duration: 0,
        is_completed: 0,
        first_opened_at: null,
        last_watched_at: null,
        completed_at: null
    };
};

module.exports = { getVideoProgress };
