const listVideosByCategoryService = require('./listVideosByCategory.service');

const getVideos = async (req, res) => {
    try {
        const { category, language_id, search } = req.query;

        let limit = parseInt(req.query.limit, 10) || 10;
        let page = parseInt(req.query.page, 10) || 1;
        let offset = (page - 1) * limit;

        if (!category) {
            return res.status(400).json({ status: false, message: 'Category is required' });
        }

        const videos = await listVideosByCategoryService.listVideosByCategoryAndLanguage(category, language_id, limit, offset, search);

        return res.status(200).json({
            status: true,
            message: 'Videos fetched successfully',
            data: videos
        });
    } catch (error) {
        console.error('Error fetching videos by category:', error);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

module.exports = { getVideos };
