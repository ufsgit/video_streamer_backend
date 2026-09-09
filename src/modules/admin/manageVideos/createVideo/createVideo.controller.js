const createVideoService = require('./createVideo.service');

const createVideo = async (req, res) => {
    try {
        const { title, description, category, video_url, language_id, language } = req.body;
        
        if (!title || !category) {
            return res.status(400).json({ success: false, message: 'Title and category are required.' });
        }

        const adminId = req.user.id;

        // Handle Thumbnail
        let thumbnailUrl = null;
        if (req.files && req.files['thumbnail'] && req.files['thumbnail'][0]) {
            thumbnailUrl = 'thumbnails/' + req.files['thumbnail'][0].filename; 
        }

        // Handle Video and Video Source
        let finalVideoUrl = null;
        let videoSource = 'external'; // default fallback

        if (req.files && req.files['video'] && req.files['video'][0]) {
            // A local video file was uploaded
            finalVideoUrl = 'videos/' + req.files['video'][0].filename;
            videoSource = 'local';
        } else if (video_url && video_url.trim() !== '') {
            // No file uploaded, but a URL was provided (e.g. YouTube)
            finalVideoUrl = video_url.trim();
            if (finalVideoUrl.includes('youtube.com') || finalVideoUrl.includes('youtu.be')) {
                videoSource = 'youtube';
            } else if (finalVideoUrl.includes('vimeo.com')) {
                videoSource = 'vimeo';
            }
        } else {
            return res.status(400).json({ success: false, message: 'You must either upload a video file or provide a video URL.' });
        }

        const newVideoId = await createVideoService.createVideo({
            title,
            description: description || null,
            videoUrl: finalVideoUrl,
            videoSource,
            thumbnailUrl,
            category,
            adminId,
            languageId: language_id || null,
            language: language || null
        });

        res.status(201).json({
            success: true,
            message: 'Video created successfully',
            data: { id: newVideoId }
        });
    } catch (error) {
        console.error('Error creating video:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    createVideo
};
