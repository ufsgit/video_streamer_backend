const listUsersService = require('./listUsers.service');

const listUsers = async (req, res) => {
    try {
        const doctorId = req.user.id;

        // Pagination logic (default to page 1, 10 items per page)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Search and Filter logic
        const dateFrom = req.query.dateFrom || null;
        const dateTo = req.query.dateTo || null;
        const searchQuery = req.query.search || null;

        const users = await listUsersService.listUsers(doctorId, limit, offset, dateFrom, dateTo, searchQuery);

        // Map over the results to format photo_url if necessary
        const formattedUsers = users.map(user => {
            return {
                ...user,
                photo_url: user.photo_url || null,
                // registered_date: user.registered_date
                //     ? new Date(user.registered_date).toISOString().split('T')[0]
                //     : null,
                
            };
        });

        res.status(200).json({
            success: true,
            data: formattedUsers
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    listUsers
};
