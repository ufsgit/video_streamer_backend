const updateProgressService = require('./updateProgress.service');

const updateProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { video_id, current_timestamp_seconds, total_watch_time_seconds, is_completed } = req.body;

        if (!video_id) {
            return res.status(400).json({ success: false, message: 'Video ID is required.' });
        }

        await updateProgressService.updateVideoProgress({
            userId,
            videoId: video_id,
            currentTimestampSeconds: current_timestamp_seconds,
            totalWatchTimeSeconds: total_watch_time_seconds,
            isCompleted: is_completed
        });

        res.status(200).json({
            success: true,
            message: 'Video progress updated successfully'
        });
        
    } catch (error) {
        console.error('Error updating video progress:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    updateProgress
};
