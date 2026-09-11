const updateLanguageService = require('./updateLanguage.service');

const updateLanguage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { language_id, language_name } = req.body;

        if (!language_id || !language_name) {
            return res.status(400).json({ success: false, message: 'Both language_id and language_name are required.' });
        }

        const success = await updateLanguageService.updateUserLanguage(userId, language_id, language_name);

        if (!success) {
            return res.status(404).json({ success: false, message: 'User not found or unable to update language.' });
        }

        res.status(200).json({
            success: true,
            message: 'User language updated successfully.'
        });
    } catch (error) {
        console.error('Error updating user language:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    updateLanguage
};
