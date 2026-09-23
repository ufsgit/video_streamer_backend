const pool = require('../../../../../db');

const formatDateForMySQL = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

const updateVideoProgress = async ({ 
    userId, 
    videoId, 
    currentTimestampSeconds, 
    totalVideoDuration,
    totalWatchTimeSeconds, 
    isCompleted,
    firstOpenedAt,
    lastWatchedAt,
    completedAt
}) => {
    const query = 'CALL upsert_user_video_progress(?, ?, ?, ?, ?, ?, ?, ?)';
    
    const finalDuration = totalVideoDuration ?? totalWatchTimeSeconds ?? 0;

    const values = [
        userId, 
        videoId, 
        currentTimestampSeconds || 0, 
        finalDuration, 
        isCompleted ? 1 : 0,
        formatDateForMySQL(firstOpenedAt),
        formatDateForMySQL(lastWatchedAt),
        formatDateForMySQL(completedAt)
    ];

    const [result] = await pool.query(query, values);
    
    // The stored procedure now ends with a SELECT statement, 
    // so result[0] contains the array of rows from that SELECT
    if (result && result[0] && result[0].length > 0) {
        return result[0][0]; 
    }
    return null;
};

module.exports = { updateVideoProgress };
