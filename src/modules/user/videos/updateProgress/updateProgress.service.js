const pool = require('../../../../../db');

const updateVideoProgress = async ({ userId, videoId, currentTimestampSeconds, totalWatchTimeSeconds, isCompleted }) => {
    const query = 'CALL upsert_user_video_progress(?, ?, ?, ?, ?)';
    
    const values = [
        userId, 
        videoId, 
        currentTimestampSeconds || 0, 
        totalWatchTimeSeconds || 0, 
        isCompleted ? 1 : 0
    ];

    const [result] = await pool.query(query, values);
    return result; 
};

module.exports = { updateVideoProgress };
