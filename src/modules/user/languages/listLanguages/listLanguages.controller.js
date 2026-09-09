const listLanguagesService = require('./listLanguages.service');

const listLanguages = async (req, res) => {
    try {
        const languages = await listLanguagesService.listLanguages();
        res.status(200).json({ success: true, data: languages });
    } catch (error) {
        console.error('Error listing languages:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { listLanguages };
