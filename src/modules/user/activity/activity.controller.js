const activityService = require('./activity.service');

/**
 * Synchronize user activity, streak, and platform time.
 * Called when the user opens the app, sends a heartbeat, or tracks time.
 */
const syncActivity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { time_spent_seconds, total_time_seconds } = req.body || {};

        const activity = await activityService.updateUserActivity(userId, {
            timeSpentSeconds: time_spent_seconds,
            totalTimeSeconds: total_time_seconds
        });

        if (!activity) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'User activity synchronized successfully',
            data: activity
        });
    } catch (error) {
        console.error('Error syncing user activity:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * Fetch current user activity, streak, and total time on platform.
 */
const getActivity = async (req, res) => {
    try {
        const userId = req.user.id;
        const activity = await activityService.getUserActivity(userId);

        if (!activity) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            data: activity
        });
    } catch (error) {
        console.error('Error fetching user activity:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * Trigger batch refresh of inactive user streaks (users inactive > 24 hours).
 */
const refreshInactiveStreaks = async (req, res) => {
    try {
        const affectedUsers = await activityService.refreshInactiveStreaks();

        return res.status(200).json({
            success: true,
            message: 'Inactive user streaks refreshed successfully',
            affected_users: affectedUsers
        });
    } catch (error) {
        console.error('Error refreshing inactive streaks:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    syncActivity,
    getActivity,
    refreshInactiveStreaks
};
