const deleteUserService = require('./deleteUser.service');

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const doctorId = req.user.id;

        await deleteUserService.deleteUser(userId, doctorId);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    deleteUser
};
