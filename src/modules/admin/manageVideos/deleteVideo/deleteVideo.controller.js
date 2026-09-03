const fs = require('fs');
const path = require('path');
const deleteVideoService = require('./deleteVideo.service');
const getVideoByIdService = require('../getVideoById/getVideoById.service');

const deleteVideo = async (req, res) => {
    try {
        const videoId = req.params.id;
        
        // Fetch old video to delete files
        const oldVideo = await getVideoByIdService.getVideoById(videoId);
        if (!oldVideo) {
            return res.status(404).json({ success: false, message: 'Video not found' });
        }

        await deleteVideoService.deleteVideo(videoId);

        // Delete local files
        if (oldVideo.thumbnail_url) {
            const thumbPath = path.join(__dirname, '../../../../../uploads', oldVideo.thumbnail_url);
            fs.unlink(thumbPath, (err) => {
                if (err && err.code !== 'ENOENT') console.error('Failed to delete old thumbnail:', err);
            });
        }
        
        if (oldVideo.video_source === 'local' && oldVideo.video_url) {
            const videoPath = path.join(__dirname, '../../../../../uploads', oldVideo.video_url);
            fs.unlink(videoPath, (err) => {
                if (err && err.code !== 'ENOENT') console.error('Failed to delete old video file:', err);
            });
        }

        res.status(200).json({ success: true, message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { deleteVideo };
