const express = require('express');
const router = express.Router();
const exportPatientReportController = require('./exportPatientReport.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/admin/users/report:
 *   get:
 *     summary: Export comprehensive patient adherence and engagement analytics for Excel / PDF
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv]
 *           default: json
 *         description: Format of the report (json for frontend tables / pdf rendering, csv for direct Excel download)
 *       - in: query
 *         name: patient_id
 *         schema:
 *           type: integer
 *         description: Filter report for a specific patient ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by patient name, email, or phone number
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Registration start date (YYYY-MM-DD)
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Registration end date (YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Inactive]
 *         description: Filter by account status
 *     responses:
 *       200:
 *         description: Comprehensive report containing all 30 patient demographic, video completion, stage adherence, and reminder metrics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */
router.get('/', protect, adminOnly, exportPatientReportController.getPatientReport);

module.exports = router;
