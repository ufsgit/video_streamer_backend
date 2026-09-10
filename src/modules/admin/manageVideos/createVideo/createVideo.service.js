const pool = require('../../../../../db');

const createVideo = async (videoData) => {
    const { 
        title, description, videoUrl, videoSource, thumbnailUrl, category, adminId, languageId, language, totalDurationSeconds 
    } = videoData;

    const [rows] = await pool.query(
        'CALL video_create(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [title, description, videoUrl, videoSource, thumbnailUrl, category, adminId, languageId, language, totalDurationSeconds]
    );

    return rows[0][0].new_video_id; 
};

module.exports = {
    createVideo
};
