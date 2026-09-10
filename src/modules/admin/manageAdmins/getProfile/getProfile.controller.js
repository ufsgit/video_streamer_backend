const getProfileService = require('./getProfile.service');

const getProfile = async (req, res) => {
    try {
        const adminId = req.user.id;
        
        const profile = await getProfileService.getAdminProfile(adminId);
        
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Admin profile not found' });
        }
        
        res.status(200).json({
            success: true,
            message: 'Admin profile fetched successfully',
            data: profile
        });
        
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { getProfile };
