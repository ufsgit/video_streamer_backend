const exportPatientReportService = require('./exportPatientReport.service');

// Ordered list of the exact 30 columns requested by user
const REPORT_COLUMNS = [
    'Patient ID',
    'Patient Name',
    'Age',
    'Gender',
    'Date of Birth',
    'Phone Number',
    'Email Address',
    'Language',
    'Registration Date',
    'Account Status',
    'Clinical Note',
    'Activity Streak',
    'Reminder Status',
    'Daily Reminder Time',
    'Total Assigned Videos',
    'Total Completed Videos',
    'Overall Completion (%)',
    'Pre-Op Assigned',
    'Pre-Op Completed',
    'Pre-Op Completion (%)',
    'Post-Op Assigned',
    'Post-Op Completed',
    'Post-Op Completion (%)',
    'Stage Adherence Ratio',
    'Stage Effort Share',
    'Total Watch Sessions',
    'Reminder-Prompted Views',
    'Self-Initiated Views',
    'Prompted Watch Percentage',
    'Adherence Classification'
];

// Specific 11 columns for compact adherence view
const COMPACT_COLUMNS = [
    'Patient ID',
    'Patient Name',
    'Age',
    'Gender',
    'Reminder Status',
    'Daily Reminder Time',
    'Total Watch Sessions',
    'Reminder-Prompted Views',
    'Self-Initiated Views',
    'Prompted Watch Percentage',
    'Adherence Classification'
];

/**
 * Escapes values for safe CSV export (handles quotes, commas, newlines).
 */
const escapeCSV = (value) => {
    if (value === null || value === undefined) return '""';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
};

/**
 * Controller to fetch comprehensive patient adherence report for Excel or PDF export.
 */
const getPatientReport = async (req, res) => {
    try {
        const doctorId = req.user?.id || null;
        const {
            patient_id,
            dateFrom,
            dateTo,
            search,
            status,
            format = 'json'
        } = req.query;

        const reportData = await exportPatientReportService.getPatientAdherenceReport({
            doctorId,
            patientId: patient_id,
            dateFrom,
            dateTo,
            searchQuery: search,
            status
        });

        // If CSV format is requested, send direct downloadable CSV stream
        if (format.toLowerCase() === 'csv') {
            const headerRow = REPORT_COLUMNS.map(col => `"${col}"`).join(',');
            const rows = reportData.map(patient => {
                return REPORT_COLUMNS.map(col => escapeCSV(patient[col])).join(',');
            });

            const csvContent = [headerRow, ...rows].join('\r\n');
            const timestamp = new Date().toISOString().slice(0, 10);
            const filename = `patient_adherence_report_${timestamp}.csv`;

            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            return res.status(200).send(csvContent);
        }

        // If compact format is requested (clean data without columns, summary, or _raw)
        const isCompact = req.query.compact === 'true' || req.query.compact === '1';
        const requestedFields = req.query.fields ? req.query.fields.split(',').map(f => f.trim()) : null;

        if (isCompact) {
            const fieldsToPick = requestedFields || COMPACT_COLUMNS;
            const cleanData = reportData.map(({ _raw, ...patientColumns }) => {
                const filtered = {};
                for (const f of fieldsToPick) {
                    if (patientColumns[f] !== undefined) {
                        filtered[f] = patientColumns[f];
                    }
                }
                return filtered;
            });

            return res.status(200).json({
                success: true,
                data: cleanData
            });
        }

        // Summary statistics for dashboard/PDF header cards
        const totalPatients = reportData.length;
        const totalAssignedAll = reportData.reduce((acc, curr) => acc + (curr['Total Assigned Videos'] || 0), 0);
        const totalCompletedAll = reportData.reduce((acc, curr) => acc + (curr['Total Completed Videos'] || 0), 0);
        const overallAverageCompletionPct = totalAssignedAll > 0 
            ? Number(((totalCompletedAll / totalAssignedAll) * 100).toFixed(2)) 
            : 0.00;

        const adherenceBreakdown = {
            highAdherence: reportData.filter(p => p['Adherence Classification'] === 'High Adherence').length,
            moderateAdherence: reportData.filter(p => p['Adherence Classification'] === 'Moderate Adherence').length,
            lowAdherence: reportData.filter(p => p['Adherence Classification'] === 'Low Adherence').length,
            nonAdherent: reportData.filter(p => p['Adherence Classification'] === 'Non-Adherent').length
        };

        // Standard JSON response with metadata, columns, and data
        return res.status(200).json({
            success: true,
            columns: REPORT_COLUMNS,
            summary: {
                totalPatients,
                totalAssignedVideos: totalAssignedAll,
                totalCompletedVideos: totalCompletedAll,
                overallAverageCompletionPct,
                adherenceBreakdown
            },
            data: reportData
        });

    } catch (error) {
        console.error('Error generating patient adherence report:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error while generating patient report',
            error: error.message
        });
    }
};

module.exports = {
    getPatientReport,
    REPORT_COLUMNS
};
