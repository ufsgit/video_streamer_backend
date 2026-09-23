const activityLogsService = require('./activityLogs.service');

const getActivityLogs = async (req, res) => {
    try {
        const logs = await activityLogsService.getActivityLogs();
        
        // Map over the results to format them exactly how the frontend needs them
        const formattedLogs = logs.map(log => {
            const videoPercent = Number(log.video_progress_percent) || 0;
            const overallPercent = log.assigned_videos > 0 
                ? Math.round((log.completed_videos / log.assigned_videos) * 100) 
                : 0;

            return {
                patient_name: log.patient_name,
                video_title: log.video_title,
                ward: log.video_title,
                last_login: log.last_login, 
                current_timestamp_seconds: log.current_timestamp_seconds || 0,
                total_video_duration: log.total_video_duration || 0,
                video_progress_percent: videoPercent,
                pre_watched: `${log.pre_watched} videos`,
                post_watched: `${log.post_watched} videos`,
                progress: `${videoPercent}% Complete`,
                raw_progress_percent: videoPercent,
                overall_progress: `${overallPercent}% Complete`,
                raw_overall_progress_percent: overallPercent
            };
        });

        res.status(200).json({
            success: true,
            data: formattedLogs
        });
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getActivityLogs
};
