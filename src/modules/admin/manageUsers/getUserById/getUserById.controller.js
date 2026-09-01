const getUserByIdService = require('./getUserById.service');

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const doctorId = req.user.id;
        
        const user = await getUserByIdService.getUserById(userId, doctorId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found or you do not have permission to view this user.' });
        }
        
        // Format photo_url if it exists
        if (user.photo_url) {
            user.photo_url = `${process.env.BASE_UPLOAD_URL}/${user.photo_url}`;
        }
        
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getUserById
};
