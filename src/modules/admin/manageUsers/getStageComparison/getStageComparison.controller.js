const getStageComparisonService = require('./getStageComparison.service');

/**
 * Controller to fetch Pre-Op & Post-Op Comparison metrics for a patient.
 */
const getStageComparison = async (req, res) => {
    try {
        const userId = req.params.userId || req.query.user_id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Patient user_id is required'
            });
        }

        const data = await getStageComparisonService.getStageComparison(userId);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Error fetching stage comparison:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error while fetching stage comparison',
            error: error.message
        });
    }
};

module.exports = {
    getStageComparison
};
