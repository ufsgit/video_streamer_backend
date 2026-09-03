const pool = require('../../../../../db');

const deleteVideo = async (videoId) => {
    await pool.query('CALL video_delete(?)', [videoId]);
    return true;
};

module.exports = { deleteVideo };
