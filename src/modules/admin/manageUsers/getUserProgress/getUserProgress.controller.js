const getUserProgressService = require('./getUserProgress.service');

const getUserProgress = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Grab the category from the query string (e.g., ?category=pre-op)
        let category = req.query.category || null; 
        
        if (category) {
            category = category.toLowerCase();
        }

        // If the user selected 'all' from Swagger, treat it as null (no filter)
        if (category === 'all') {
            category = null;
        }
        
        // Pass it to the service
        const progressData = await getUserProgressService.getUserProgress(userId, category);
        
        if (!progressData) {
            return res.status(404).json({ success: false, message: 'Progress data not found for this user.' });
        }
        
        res.status(200).json({
            success: true,
            data: progressData
        });
    } catch (error) {
        console.error('Error fetching user progress:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getUserProgress
};
