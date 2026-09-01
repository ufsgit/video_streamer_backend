const activityLogsService = require('./activityLogs.service');

const getActivityLogs = async (req, res) => {
    try {
        const logs = await activityLogsService.getActivityLogs();
        
        // Map over the results to format them exactly how the frontend needs them
        const formattedLogs = logs.map(log => {
            const progressPercent = log.assigned_videos > 0 
                ? Math.round((log.completed_videos / log.assigned_videos) * 100) 
                : 0;

            return {
                patient_name: log.patient_name,
                ward: log.ward,
                last_login: log.last_login, // You might want to format this with a library like dayjs or date-fns in a real app
                videos_watched: `${log.completed_videos}/${log.assigned_videos}`,
                progress: `${progressPercent}% Complete`,
                raw_progress_percent: progressPercent
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
