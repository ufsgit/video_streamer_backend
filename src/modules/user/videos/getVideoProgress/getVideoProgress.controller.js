const getVideoProgressService = require('./getVideoProgress.service');

const getVideoProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const videoId = req.params.videoId || req.query.video_id;

        if (!videoId) {
            return res.status(400).json({
                success: false,
                message: 'videoId parameter is required.'
            });
        }

        const data = await getVideoProgressService.getVideoProgress(userId, videoId);

        res.status(200).json({
            success: true,
            message: 'Video progress retrieved successfully',
            data
        });
    } catch (error) {
        console.error('Error fetching video progress:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

module.exports = { getVideoProgress };
