const pool = require('../../../../db');

/**
 * Updates user activity, calculates streak, and updates platform time.
 * @param {number} userId
 * @param {object} options
 * @param {number} [options.timeSpentSeconds]
 * @param {number} [options.totalTimeSeconds]
 * @returns {Promise<object>} Updated activity object
 */
const updateUserActivity = async (userId, { timeSpentSeconds = null, totalTimeSeconds = null } = {}) => {
    const timeSpent = timeSpentSeconds !== null && timeSpentSeconds !== undefined ? Number(timeSpentSeconds) : null;
    const totalTime = totalTimeSeconds !== null && totalTimeSeconds !== undefined ? Number(totalTimeSeconds) : null;

    const [rows] = await pool.query('CALL update_user_activity(?, ?, ?)', [
        userId,
        timeSpent,
        totalTime
    ]);

    return rows && rows[0] && rows[0][0] ? rows[0][0] : null;
};

/**
 * Gets user activity, resetting streak if inactive for > 24 hours.
 * @param {number} userId
 * @returns {Promise<object>} Activity object
 */
const getUserActivity = async (userId) => {
    const [rows] = await pool.query('CALL get_user_activity(?)', [userId]);
    return rows && rows[0] && rows[0][0] ? rows[0][0] : null;
};

/**
 * Batch resets streak to 0 for users who have been inactive for > 24 hours.
 * @returns {Promise<number>} Number of affected users
 */
const refreshInactiveStreaks = async () => {
    const [rows] = await pool.query('CALL refresh_inactive_user_streaks()');
    return rows && rows[0] && rows[0][0] ? rows[0][0].affected_users : 0;
};

module.exports = {
    updateUserActivity,
    getUserActivity,
    refreshInactiveStreaks
};
