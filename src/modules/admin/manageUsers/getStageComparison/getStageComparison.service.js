const pool = require('../../../../../db');

/**
 * Format seconds into mm:ss or hh:mm:ss
 * e.g. 46 -> "0:46", 986 -> "16:26"
 */
const formatDuration = (totalSeconds) => {
    if (!totalSeconds || totalSeconds <= 0) return '0:00';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Calls the get_user_stage_comparison stored procedure and formats the data
 * specifically tailored for the Pre-Op & Post-Op Comparison UI card.
 * 
 * @param {number} userId - Patient User ID
 * @returns {Promise<object>}
 */
const getStageComparison = async (userId) => {
    const [rows] = await pool.query('CALL get_user_stage_comparison(?)', [userId]);

    if (!rows || rows.length === 0 || rows[0].length === 0) {
        return null;
    }

    const r = rows[0][0];

    // Numbers for Pre-Op
    const preOpTotalVideos = Number(r.pre_op_total_videos) || 0;
    const preOpCompleted = Number(r.pre_op_completed_videos) || 0;
    const preOpInProgress = Number(r.pre_op_in_progress_videos) || 0;
    const preOpNotStarted = Math.max(0, preOpTotalVideos - (preOpCompleted + preOpInProgress));
    const preOpWatchedSecs = Number(r.pre_op_watched_seconds) || 0;
    const preOpDurationSecs = Number(r.pre_op_total_duration_seconds) || 0;

    // Numbers for Post-Op
    const postOpTotalVideos = Number(r.post_op_total_videos) || 0;
    const postOpCompleted = Number(r.post_op_completed_videos) || 0;
    const postOpInProgress = Number(r.post_op_in_progress_videos) || 0;
    const postOpNotStarted = Math.max(0, postOpTotalVideos - (postOpCompleted + postOpInProgress));
    const postOpWatchedSecs = Number(r.post_op_watched_seconds) || 0;
    const postOpDurationSecs = Number(r.post_op_total_duration_seconds) || 0;

    // Stage Effort Share (% of completed videos)
    const totalCompleted = preOpCompleted + postOpCompleted;
    const preOpEffortPct = totalCompleted > 0 ? Math.round((preOpCompleted / totalCompleted) * 100) : 0;
    const postOpEffortPct = totalCompleted > 0 ? (100 - preOpEffortPct) : 0;

    // Time-based Effort Share (% of total watch time)
    const totalWatchedTime = preOpWatchedSecs + postOpWatchedSecs;
    const preOpTimeEffortPct = totalWatchedTime > 0 ? Math.round((preOpWatchedSecs / totalWatchedTime) * 100) : 0;
    const postOpTimeEffortPct = totalWatchedTime > 0 ? (100 - preOpTimeEffortPct) : 0;

    return {
        patient: {
            id: r.user_id,
            name: r.patient_name,
            language_id: r.language_id,
            language_name: r.language_name
        },
        pre_op: {
            total_videos: preOpTotalVideos,
            completed_videos: preOpCompleted,
            in_progress_videos: preOpInProgress,
            not_started_videos: preOpNotStarted,
            watched_seconds: preOpWatchedSecs,
            total_duration_seconds: preOpDurationSecs,
            watched_time_formatted: formatDuration(preOpWatchedSecs),
            total_duration_formatted: formatDuration(preOpDurationSecs),
            display_text: `${formatDuration(preOpWatchedSecs)} / ${formatDuration(preOpDurationSecs)} watched`,
            progress_pct: preOpDurationSecs > 0 ? Number(((preOpWatchedSecs / preOpDurationSecs) * 100).toFixed(1)) : 0
        },
        post_op: {
            total_videos: postOpTotalVideos,
            completed_videos: postOpCompleted,
            in_progress_videos: postOpInProgress,
            not_started_videos: postOpNotStarted,
            watched_seconds: postOpWatchedSecs,
            total_duration_seconds: postOpDurationSecs,
            watched_time_formatted: formatDuration(postOpWatchedSecs),
            total_duration_formatted: formatDuration(postOpDurationSecs),
            display_text: `${formatDuration(postOpWatchedSecs)} / ${formatDuration(postOpDurationSecs)} watched`,
            progress_pct: postOpDurationSecs > 0 ? Number(((postOpWatchedSecs / postOpDurationSecs) * 100).toFixed(1)) : 0
        },
        stage_effort_share: {
            pre_op_effort_pct: preOpEffortPct,
            post_op_effort_pct: postOpEffortPct,
            pre_op_label: `Pre-Op Effort: ${preOpEffortPct}% (${preOpCompleted} watched)`,
            post_op_label: `Post-Op Effort: ${postOpEffortPct}% (${postOpCompleted} watched)`,
            time_based: {
                pre_op_time_pct: preOpTimeEffortPct,
                post_op_time_pct: postOpTimeEffortPct
            }
        },
        _raw: r
    };
};

module.exports = {
    getStageComparison,
    formatDuration
};
