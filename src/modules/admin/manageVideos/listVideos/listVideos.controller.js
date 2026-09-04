const listVideosService = require('./listVideos.service');

const listVideos = async (req, res) => {
    try {
        const adminId = req.user.id;
        
        let limit = parseInt(req.query.limit, 10) || 10;
        let page = parseInt(req.query.page, 10) || 1;
        let offset = (page - 1) * limit;

        const category = req.query.category || 'all'; 
        const source = req.query.source || 'all'; 
        const search = req.query.search || null;

        const videos = await listVideosService.listVideos(adminId, limit, offset, category, source, search);

        res.status(200).json({ success: true, data: videos });
    } catch (error) {
        console.error('Error listing videos:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { listVideos };
