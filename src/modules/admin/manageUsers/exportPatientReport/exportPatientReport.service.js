const pool = require('../../../../../db');

/**
 * Service to aggregate comprehensive patient adherence and engagement report.
 * Computes all 30 demographic, video completion, stage comparison, and session metrics.
 * 
 * @param {object} params
 * @param {number} params.doctorId - Logged-in doctor ID (from auth middleware)
 * @param {number} [params.patientId] - Optional filter for a specific patient ID
 * @param {string} [params.dateFrom] - Optional filter for registration date (YYYY-MM-DD)
 * @param {string} [params.dateTo] - Optional filter for registration date (YYYY-MM-DD)
 * @param {string} [params.searchQuery] - Optional search by patient name, email, or phone
 * @param {string} [params.status] - Optional filter for account status ('Active' | 'Inactive')
 * @returns {Promise<Array<object>>} Formatted patient report rows
 */
const getPatientAdherenceReport = async ({
    doctorId,
    patientId = null,
    dateFrom = null,
    dateTo = null,
    searchQuery = null,
    status = null
} = {}) => {
    let whereClauses = [];
    let queryParams = [];

    // Filter by doctor if present
    if (doctorId) {
        whereClauses.push('(u.doctor_id = ? OR u.doctor_id IS NULL)');
        queryParams.push(doctorId);
    }

    // Filter by specific patient ID
    if (patientId) {
        whereClauses.push('u.id = ?');
        queryParams.push(Number(patientId));
    }

    // Filter by registration date range
    if (dateFrom) {
        whereClauses.push('DATE(u.registered_date) >= ?');
        queryParams.push(dateFrom);
    }
    if (dateTo) {
        whereClauses.push('DATE(u.registered_date) <= ?');
        queryParams.push(dateTo);
    }

    // Filter by status
    if (status) {
        whereClauses.push('u.status = ?');
        queryParams.push(status);
    }

    // Search query
    if (searchQuery) {
        whereClauses.push('(u.name LIKE CONCAT(?, "%") OR u.email LIKE CONCAT(?, "%") OR u.phone_number LIKE CONCAT(?, "%"))');
        queryParams.push(searchQuery, searchQuery, searchQuery);
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const sql = `
        SELECT 
            u.id AS patient_id,
            u.name AS patient_name,
            COALESCE(u.age, TIMESTAMPDIFF(YEAR, u.dob, CURDATE())) AS age,
            u.sex AS gender,
            DATE_FORMAT(u.dob, '%Y-%m-%d') AS date_of_birth,
            COALESCE(u.phone_number, '') AS phone_number,
            COALESCE(u.email, '') AS email_address,
            COALESCE(u.language_name, l.language_name, 'Not Specified') AS language,
            DATE_FORMAT(u.registered_date, '%Y-%m-%d %H:%i:%s') AS registration_date,
            u.status AS account_status,
            COALESCE(u.note, '') AS clinical_note,
            COALESCE(u.current_streak, 0) AS activity_streak,
            CASE WHEN ur.is_enabled = 1 THEN 'Enabled' ELSE 'Disabled' END AS reminder_status,
            CASE WHEN ur.is_enabled = 1 THEN TIME_FORMAT(ur.reminder_time, '%H:%i:%s') ELSE 'N/A' END AS daily_reminder_time,
            
            -- Video Assignments based on patient's language
            (SELECT COUNT(*) FROM videos v WHERE (u.language_id IS NULL OR v.language_id = u.language_id) AND v.category = 'pre-op') AS pre_op_assigned,
            (SELECT COUNT(*) FROM videos v WHERE (u.language_id IS NULL OR v.language_id = u.language_id) AND v.category = 'post-op') AS post_op_assigned,

            -- Completed videos in Pre-Op and Post-Op
            (SELECT COUNT(*) FROM user_video_progress uvp 
             JOIN videos v ON uvp.video_id = v.id 
             WHERE uvp.user_id = u.id AND uvp.is_completed = 1 AND v.category = 'pre-op'
            ) AS pre_op_completed,
            
            (SELECT COUNT(*) FROM user_video_progress uvp 
             JOIN videos v ON uvp.video_id = v.id 
             WHERE uvp.user_id = u.id AND uvp.is_completed = 1 AND v.category = 'post-op'
            ) AS post_op_completed,

            -- Total Watch Sessions: from user_reminder_views if available, else active progress rows
            (SELECT COALESCE(
                NULLIF((SELECT COUNT(*) FROM user_reminder_views urv WHERE urv.user_id = u.id), 0),
                (SELECT COUNT(*) FROM user_video_progress uvp WHERE uvp.user_id = u.id AND (uvp.current_timestamp_seconds > 0 OR uvp.last_watched_at IS NOT NULL)),
                0
            )) AS total_watch_sessions,

            -- Reminder-Prompted Views: from user_reminder_views where is_prompted = 1, else calculated dynamically
            (SELECT COALESCE(
                (SELECT COUNT(*) FROM user_reminder_views urv WHERE urv.user_id = u.id AND urv.is_prompted = 1),
                (SELECT COUNT(*) FROM user_video_progress uvp 
                 WHERE uvp.user_id = u.id 
                   AND uvp.last_watched_at IS NOT NULL 
                   AND ur.is_enabled = 1 
                   AND (
                       (ur.reminder_time <= ADDTIME(ur.reminder_time, '02:00:00') AND TIME(uvp.last_watched_at) BETWEEN ur.reminder_time AND ADDTIME(ur.reminder_time, '02:00:00'))
                       OR 
                       (ur.reminder_time > ADDTIME(ur.reminder_time, '02:00:00') AND (TIME(uvp.last_watched_at) >= ur.reminder_time OR TIME(uvp.last_watched_at) <= ADDTIME(ur.reminder_time, '02:00:00')))
                   )
                ),
                0
            )) AS reminder_prompted_views

        FROM users u
        LEFT JOIN user_reminders ur ON ur.user_id = u.id
        LEFT JOIN languages l ON l.id = u.language_id
        ${whereSQL}
        ORDER BY u.registered_date DESC
    `;

    const [rows] = await pool.query(sql, queryParams);

    return rows.map(r => {
        const preOpAssigned = Number(r.pre_op_assigned) || 0;
        const postOpAssigned = Number(r.post_op_assigned) || 0;
        const preOpCompleted = Number(r.pre_op_completed) || 0;
        const postOpCompleted = Number(r.post_op_completed) || 0;

        const totalAssigned = preOpAssigned + postOpAssigned;
        const totalCompleted = preOpCompleted + postOpCompleted;

        // Completion Percentages
        const overallCompletionPct = totalAssigned > 0 
            ? Number(((totalCompleted / totalAssigned) * 100).toFixed(2)) 
            : 0.00;

        const preOpCompletionPct = preOpAssigned > 0 
            ? Number(((preOpCompleted / preOpAssigned) * 100).toFixed(2)) 
            : 0.00;

        const postOpCompletionPct = postOpAssigned > 0 
            ? Number(((postOpCompleted / postOpAssigned) * 100).toFixed(2)) 
            : 0.00;

        // 1. Stage Adherence Ratio (Pre-Op Completion % vs Post-Op Completion %)
        // Compares patient diligence before surgery vs during recovery
        let stageAdherenceRatio = 'N/A';
        let stageAdherenceRatioDecimal = null;
        if (preOpCompletionPct > 0 && postOpCompletionPct > 0) {
            const ratio = Number((preOpCompletionPct / postOpCompletionPct).toFixed(2));
            stageAdherenceRatioDecimal = ratio;
            stageAdherenceRatio = `${ratio.toFixed(2)} : 1`;
        } else if (preOpCompletionPct > 0 && postOpCompletionPct === 0) {
            stageAdherenceRatio = 'Pre-Op Only (1.00 : 0)';
            stageAdherenceRatioDecimal = 1.0;
        } else if (preOpCompletionPct === 0 && postOpCompletionPct > 0) {
            stageAdherenceRatio = 'Post-Op Only (0 : 1.00)';
            stageAdherenceRatioDecimal = 0.0;
        } else {
            stageAdherenceRatio = '0 : 0';
            stageAdherenceRatioDecimal = 0.0;
        }

        // 2. Stage Effort Share (Pre-Op Completed vs Post-Op Completed out of Total Completed)
        // Shows the percentage distribution of patient workload between stages
        let stageEffortShare = 'Pre: 0% | Post: 0%';
        let preEffortPct = 0;
        let postEffortPct = 0;
        if (totalCompleted > 0) {
            preEffortPct = Math.round((preOpCompleted / totalCompleted) * 100);
            postEffortPct = 100 - preEffortPct;
            stageEffortShare = `Pre: ${preEffortPct}% | Post: ${postEffortPct}%`;
        }

        // 3. Watch Sessions & Prompted Views
        const totalSessions = Number(r.total_watch_sessions) || 0;
        const promptedViews = Number(r.reminder_prompted_views) || 0;
        const selfInitiatedViews = Math.max(0, totalSessions - promptedViews);
        const promptedWatchRatioPct = totalSessions > 0 
            ? Number(((promptedViews / totalSessions) * 100).toFixed(2)) 
            : 0.00;

        // 4. Clinical Adherence Classification
        let adherenceClassification = 'Non-Adherent';
        if (overallCompletionPct >= 80) {
            adherenceClassification = 'High Adherence';
        } else if (overallCompletionPct >= 50) {
            adherenceClassification = 'Moderate Adherence';
        } else if (overallCompletionPct > 0) {
            adherenceClassification = 'Low Adherence';
        }

        return {
            // Exact labels matching user-requested Excel headers
            'Patient ID': r.patient_id,
            'Patient Name': r.patient_name || 'N/A',
            'Age': r.age ?? 'N/A',
            'Gender': r.gender || 'N/A',
            'Date of Birth': r.date_of_birth || 'N/A',
            'Phone Number': r.phone_number || 'N/A',
            'Email Address': r.email_address || 'N/A',
            'Language': r.language,
            'Registration Date': r.registration_date,
            'Account Status': r.account_status,
            'Clinical Note': r.clinical_note || 'N/A',
            'Activity Streak': r.activity_streak,
            'Reminder Status': r.reminder_status,
            'Daily Reminder Time': r.daily_reminder_time,
            'Total Assigned Videos': totalAssigned,
            'Total Completed Videos': totalCompleted,
            'Overall Completion (%)': overallCompletionPct,
            'Pre-Op Assigned': preOpAssigned,
            'Pre-Op Completed': preOpCompleted,
            'Pre-Op Completion (%)': preOpCompletionPct,
            'Post-Op Assigned': postOpAssigned,
            'Post-Op Completed': postOpCompleted,
            'Post-Op Completion (%)': postOpCompletionPct,
            'Stage Adherence Ratio': stageAdherenceRatio,
            'Stage Effort Share': stageEffortShare,
            'Total Watch Sessions': totalSessions,
            'Reminder-Prompted Views': promptedViews,
            'Self-Initiated Views': selfInitiatedViews,
            'Prompted Watch Percentage': Number(promptedWatchRatioPct),
            'Adherence Classification': adherenceClassification,

            // Also include camelCase fields for structured frontend programmatic usage
            _raw: {
                patientId: r.patient_id,
                patientName: r.patient_name,
                age: r.age,
                gender: r.gender,
                dateOfBirth: r.date_of_birth,
                phoneNumber: r.phone_number,
                emailAddress: r.email_address,
                language: r.language,
                registrationDate: r.registration_date,
                accountStatus: r.account_status,
                clinicalNote: r.clinical_note,
                activityStreak: r.activity_streak,
                reminderStatus: r.reminder_status,
                dailyReminderTime: r.daily_reminder_time,
                totalAssignedVideos: totalAssigned,
                totalCompletedVideos: totalCompleted,
                overallCompletionPct,
                preOpAssigned,
                preOpCompleted,
                preOpCompletionPct,
                postOpAssigned,
                postOpCompleted,
                postOpCompletionPct,
                stageAdherenceRatio,
                stageAdherenceRatioDecimal,
                stageEffortShare,
                preEffortPct,
                postEffortPct,
                totalWatchSessions: totalSessions,
                reminderPromptedViews: promptedViews,
                selfInitiatedViews,
                promptedWatchPercentage: Number(promptedWatchRatioPct),
                adherenceClassification
            }
        };
    });
};

module.exports = {
    getPatientAdherenceReport
};
