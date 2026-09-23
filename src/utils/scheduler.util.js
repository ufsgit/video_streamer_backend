const { refreshInactiveStreaks } = require('../modules/user/activity/activity.service');

let intervalTimer = null;

/**
 * Starts the periodic background job to refresh user streaks.
 * Runs on startup and periodically (every hour) to reset current_streak to 0
 * for any user who hasn't logged in or used the platform for > 24 hours.
 * @param {number} [intervalMs=3600000] Interval in milliseconds (default: 1 hour)
 */
const initStreakScheduler = (intervalMs = 60 * 60 * 1000) => {
    const runTask = async () => {
        try {
            const affected = await refreshInactiveStreaks();
            if (affected > 0) {
                console.log(`[Streak Scheduler] Successfully refreshed ${affected} inactive user streak(s) to 0.`);
            }
        } catch (error) {
            console.error('[Streak Scheduler] Error refreshing inactive streaks:', error.message);
        }
    };

    // Run once on server startup
    runTask();

    // Set recurring timer
    if (intervalTimer) {
        clearInterval(intervalTimer);
    }
    intervalTimer = setInterval(runTask, intervalMs);

    // Ensure timer does not prevent graceful process termination if needed
    if (intervalTimer.unref) {
        intervalTimer.unref();
    }

    console.log(`[Streak Scheduler] Initialized (running every ${Math.round(intervalMs / 60000)} minutes).`);
};

module.exports = {
    initStreakScheduler
};
