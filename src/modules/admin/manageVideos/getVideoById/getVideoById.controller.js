const getVideoByIdService = require('./getVideoById.service');

const getVideoById = async (req, res) => {
    try {
        const video = await getVideoByIdService.getVideoById(req.params.id);
        if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
        
        if (video.thumbnail_url) video.thumbnail_url = `${process.env.BASE_UPLOAD_URL}/${video.thumbnail_url}`;
        if (video.video_source === 'local' && video.video_url) video.video_url = `${process.env.BASE_UPLOAD_URL}/${video.video_url}`;

        res.status(200).json({ success: true, data: video });
    } catch (error) {
        console.error('Error getting video:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { getVideoById };
