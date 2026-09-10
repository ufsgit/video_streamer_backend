const pool = require('../../../../../db');

const editVideo = async (videoData) => {
    const { videoId, title, description, videoUrl, videoSource, thumbnailUrl, category, languageId, language, totalDurationSeconds } = videoData;
    
    await pool.query(
        'CALL video_edit(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [videoId, title, description, videoUrl, videoSource, thumbnailUrl, category, languageId, language, totalDurationSeconds]
    );
    
    return true;
};

module.exports = { editVideo };
