const avgVideosService = require('./avgVideosWatched.service');

const getAvgVideosWatched = async (req, res) => {
    try {
        const data = await avgVideosService.getAvgVideosWatched();
        
        // Format to 1 decimal place (e.g., 3.4) as seen in your UI design
        const formattedAvg = parseFloat(data.avg_videos).toFixed(1);

        res.status(200).json({
            success: true,
            data: {
                avg_videos_watched: formattedAvg
            }
        });
    } catch (error) {
        console.error('Error fetching avg videos:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getAvgVideosWatched
};
