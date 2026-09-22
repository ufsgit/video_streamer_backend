const getUserVideoHistoryService = require('./getUserVideoHistory.service');

const getUserVideoHistory = async (req, res) => {
    try {
        const userId = req.params.id;
        let category = req.query.category || null; 
        
        if (category) {
            category = category.toLowerCase();
        }

        if (category === 'all') {
            category = null;
        }
        
        const historyData = await getUserVideoHistoryService.getUserVideoHistory(userId, category);
        
        res.status(200).json({
            success: true,
            data: historyData
        });
    } catch (error) {
        console.error('Error fetching video history:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { getUserVideoHistory };
