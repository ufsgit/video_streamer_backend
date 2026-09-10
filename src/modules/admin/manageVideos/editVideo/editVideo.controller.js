const fs = require('fs');
const path = require('path');
const editVideoService = require('./editVideo.service');
const getVideoByIdService = require('../getVideoById/getVideoById.service');

const editVideo = async (req, res) => {
    try {
        const videoId = req.params.id;
        const { title, description, category, video_url, language_id, language, total_duration_seconds } = req.body;
        
        const oldVideo = await getVideoByIdService.getVideoById(videoId);
        if (!oldVideo) {
            return res.status(404).json({ success: false, message: 'Video not found' });
        }

        let thumbnailUrl = null;
        if (req.files && req.files['thumbnail'] && req.files['thumbnail'][0]) {
            thumbnailUrl = 'thumbnails/' + req.files['thumbnail'][0].filename; 
            
            // Delete old thumbnail
            if (oldVideo.thumbnail_url) {
                const thumbPath = path.join(__dirname, '../../../../../uploads', oldVideo.thumbnail_url);
                fs.unlink(thumbPath, (err) => {
                    if (err && err.code !== 'ENOENT') console.error('Failed to delete old thumbnail:', err);
                });
            }
        }

        let finalVideoUrl = null;
        let videoSource = null;

        if (req.files && req.files['video'] && req.files['video'][0]) {
            finalVideoUrl = 'videos/' + req.files['video'][0].filename;
            videoSource = 'local';
            
            // Delete old video if it was local
            if (oldVideo.video_source === 'local' && oldVideo.video_url) {
                const videoPath = path.join(__dirname, '../../../../../uploads', oldVideo.video_url);
                fs.unlink(videoPath, (err) => {
                    if (err && err.code !== 'ENOENT') console.error('Failed to delete old video:', err);
                });
            }
        } else if (video_url && video_url.trim() !== '') {
            finalVideoUrl = video_url.trim();
            if (finalVideoUrl.includes('youtube.com') || finalVideoUrl.includes('youtu.be')) {
                videoSource = 'youtube';
            } else if (finalVideoUrl.includes('vimeo.com')) {
                videoSource = 'vimeo';
            } else {
                videoSource = 'external';
            }
            
            // Delete old video if it was local, since we switched to external
            if (oldVideo.video_source === 'local' && oldVideo.video_url) {
                const videoPath = path.join(__dirname, '../../../../../uploads', oldVideo.video_url);
                fs.unlink(videoPath, (err) => {
                    if (err && err.code !== 'ENOENT') console.error('Failed to delete old video:', err);
                });
            }
        }

        await editVideoService.editVideo({
            videoId,
            title: title || null,
            description: description !== undefined ? description : null,
            videoUrl: finalVideoUrl,
            videoSource,
            thumbnailUrl,
            category: category || null,
            languageId: language_id || null,
            language: language || null,
            totalDurationSeconds: total_duration_seconds !== undefined ? total_duration_seconds : null
        });

        res.status(200).json({ success: true, message: 'Video updated successfully' });
    } catch (error) {
        console.error('Error editing video:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { editVideo };
