const updateProgressService = require('./updateProgress.service');

const updateProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { 
            video_id, 
            current_timestamp_seconds, 
            total_video_duration,
            total_watch_time_seconds, 
            is_completed,
            first_opened_at,
            last_watched_at,
            completed_at
        } = req.body;

        if (!video_id) {
            return res.status(400).json({ success: false, message: 'Video ID is required.' });
        }

        const totalDuration = total_video_duration ?? total_watch_time_seconds ?? 0;

        const progressData = await updateProgressService.updateVideoProgress({
            userId,
            videoId: video_id,
            currentTimestampSeconds: current_timestamp_seconds,
            totalVideoDuration: totalDuration,
            isCompleted: is_completed,
            firstOpenedAt: first_opened_at,
            lastWatchedAt: last_watched_at,
            completedAt: completed_at
        });

        res.status(200).json({
            success: true,
            message: 'Video progress updated successfully',
            data: progressData
        });
        
    } catch (error) {
        console.error('Error updating video progress:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    updateProgress
};
