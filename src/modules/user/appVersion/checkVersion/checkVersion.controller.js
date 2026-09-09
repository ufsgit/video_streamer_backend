const { checkVersion } = require('./checkVersion.service');

const checkAppVersion = async (req, res) => {
    try {
        let { current_version, is_admin_update } = req.query;

        if (current_version === undefined || is_admin_update === undefined) {
            return res.status(400).json({ error: 'current_version and is_admin_update are required' });
        }

        // Convert types
        current_version = String(current_version);
        is_admin_update = Number(is_admin_update);

        // Fetch the exact response directly from the Stored Procedure
        const dbResult = await checkVersion(current_version, is_admin_update);
        const versionDetails = Array.isArray(dbResult) ? dbResult[0] : dbResult;

        if (!versionDetails) {
            return res.status(404).json({ message: 'No version details found' });
        }

        // Return the SP's pre-calculated output exactly as-is
        return res.status(200).json(versionDetails);

    } catch (error) {
        console.error('Error checking app version:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { checkAppVersion };
