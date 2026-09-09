const { listAdmins: listAdminsService } = require('./listAdmins.service');

const listAdmins = async (req, res) => {
    try {
        const admins = await listAdminsService();

        return res.status(200).json({
            success: true,
            data: admins
        });
    } catch (error) {
        console.error('Error fetching admins:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { listAdmins };
