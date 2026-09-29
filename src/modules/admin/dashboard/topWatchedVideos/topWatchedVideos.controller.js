const topWatchedVideosService = require('./topWatchedVideos.service');

const getTopWatchedVideos = async (req, res) => {
    try {
        const data = await topWatchedVideosService.getTopWatchedVideos();
        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error('Error fetching top watched videos:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getTopWatchedVideos
};
