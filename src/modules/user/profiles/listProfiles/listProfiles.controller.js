const { listUserProfiles } = require('./listProfiles.service');

const listProfiles = async (req, res) => {
    try {
        // req.user is set by the protect middleware based on the JWT token
        const userId = req.user.id; 
        
        const profile = await listUserProfiles(userId);

        if (!profile) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        return res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { listProfiles };
