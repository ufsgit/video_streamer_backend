const getUserEngagementService = require('./getUserEngagement.service');

const getUserEngagement = async (req, res) => {
    try {
        const userId = req.params.id;
        // Parse the query parameter, ignoring 'null' or 'undefined' string literals
        let languageId = req.query.language_id;
        if (languageId === 'null' || languageId === 'undefined') {
            languageId = null;
        }
        
        const engagement = await getUserEngagementService.getUserEngagement(userId, languageId);
        
        if (!engagement) {
            return res.status(404).json({ success: false, message: 'Engagement data not found for this user.' });
        }
        
        res.status(200).json({
            success: true,
            data: engagement
        });
    } catch (error) {
        console.error('Error fetching user engagement:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getUserEngagement
};
