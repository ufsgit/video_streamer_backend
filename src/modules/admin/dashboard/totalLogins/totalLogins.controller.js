const totalLoginsService = require('./totalLogins.service');

const getTotalLogins = async (req, res) => {
    try {
        const data = await totalLoginsService.getTotalLogins();
        res.status(200).json({
            success: true,
            data: {
                total_logins: data.total_logins
            }
        });
    } catch (error) {
        console.error('Error fetching total logins:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getTotalLogins
};
