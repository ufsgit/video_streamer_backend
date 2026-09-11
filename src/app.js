const express = require('express');
const cors = require('cors');
const path = require('path');
const setupSwagger = require('./swagger');

const app = express();

setupSwagger(app);

// 1. Pull the allowed production URL from the .env file
const productionUrl = process.env.PRODUCTION_URL; 

// 2. Check the environment variable from the .env file
const isDevelopment = process.env.NODE_ENV === 'development';

// 3. Configure CORS dynamically
const corsOptions = {
  origin: function (origin, callback) {
    // If in development mode, allow everything
    if (isDevelopment) {
      return callback(null, true);
    }

    // If in production, strictly enforce the production URL from .env
    if (origin === productionUrl || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// 4. Apply the CORS middleware
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Global Request Logger Middleware
// app.use((req, res, next) => {
//     console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//     if (Object.keys(req.body || {}).length > 0) console.log("Body:", req.body);
//     if (req.files) console.log("Files:", req.files);
//     next();
// });

// Serve the uploads folder as static files (so Flutter can access videos/images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Basic health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Video Streamer API is running' });
});

// Import and mount feature routes
const authRoutes = require('./modules/auth/auth.routes');
app.use('/api/auth', authRoutes);

// Dashboard Routes
const totalLoginsRoutes = require('./modules/admin/dashboard/totalLogins/totalLogins.routes');
const avgVideosRoutes = require('./modules/admin/dashboard/avgVideosWatched/avgVideosWatched.routes');
const completionRateRoutes = require('./modules/admin/dashboard/completionRate/completionRate.routes');
const activityLogsRoutes = require('./modules/admin/dashboard/activityLogs/activityLogs.routes');

app.use('/api/admin/dashboard/total-logins', totalLoginsRoutes);
app.use('/api/admin/dashboard/avg-videos', avgVideosRoutes);
app.use('/api/admin/dashboard/completion-rate', completionRateRoutes);
app.use('/api/admin/dashboard/activity-logs', activityLogsRoutes);

// Manage Users Routes
const createUserRoutes = require('./modules/admin/manageUsers/createUser/createUser.routes');
const listUsersRoutes = require('./modules/admin/manageUsers/listUsers/listUsers.routes');
const getUserByIdRoutes = require('./modules/admin/manageUsers/getUserById/getUserById.routes');
const getUserEngagementRoutes = require('./modules/admin/manageUsers/getUserEngagement/getUserEngagement.routes');
const editUserRoutes = require('./modules/admin/manageUsers/editUser/editUser.routes');
const deleteUserRoutes = require('./modules/admin/manageUsers/deleteUser/deleteUser.routes');

// Mount routes
app.use('/api/admin/users/create', createUserRoutes);
app.use('/api/admin/users/list', listUsersRoutes);
app.use('/api/admin/users/get', getUserByIdRoutes);
app.use('/api/admin/users/engagement', getUserEngagementRoutes);
app.use('/api/admin/users/edit', editUserRoutes);
app.use('/api/admin/users/delete', deleteUserRoutes);

const listAdminsRoutes = require('./modules/admin/manageAdmins/listAdmins/listAdmins.routes');
app.use('/api/admin/admins/list', listAdminsRoutes);

const getAdminProfileRoutes = require('./modules/admin/manageAdmins/getProfile/getProfile.routes');
app.use('/api/admin/profile', getAdminProfileRoutes);


// Manage Videos Routes
const createVideoRoutes = require('./modules/admin/manageVideos/createVideo/createVideo.routes');
const listVideosRoutes = require('./modules/admin/manageVideos/listVideos/listVideos.routes');
const getVideoByIdRoutes = require('./modules/admin/manageVideos/getVideoById/getVideoById.routes');
const editVideoRoutes = require('./modules/admin/manageVideos/editVideo/editVideo.routes');
const deleteVideoRoutes = require('./modules/admin/manageVideos/deleteVideo/deleteVideo.routes');

app.use('/api/admin/videos/create', createVideoRoutes);
app.use('/api/admin/videos/list', listVideosRoutes);
app.use('/api/admin/videos/get', getVideoByIdRoutes);
app.use('/api/admin/videos/edit', editVideoRoutes);
app.use('/api/admin/videos/delete', deleteVideoRoutes);

// Manage Languages Routes (Admin)
const listAdminLanguagesRoutes = require('./modules/admin/languages/listLanguages/listLanguages.routes');
app.use('/api/admin/languages/list', listAdminLanguagesRoutes);

// User Facing Routes
const listLanguagesRoutes = require('./modules/user/languages/listLanguages/listLanguages.routes');
const listUserVideosRoutes = require('./modules/user/videos/listVideosByCategory/listVideosByCategory.routes');
const updateVideoProgressRoutes = require('./modules/user/videos/updateProgress/updateProgress.routes');

app.use('/api/user/languages/list', listLanguagesRoutes);
app.use('/api/user/videos/list', listUserVideosRoutes);
app.use('/api/user/videos/progress', updateVideoProgressRoutes);

const listProfilesRoutes = require('./modules/user/profiles/listProfiles/listProfiles.routes');
const updateLanguageRoutes = require('./modules/user/profiles/updateLanguage/updateLanguage.routes');

app.use('/api/user/profiles/list', listProfilesRoutes);
app.use('/api/user/profiles/language', updateLanguageRoutes);

// App Version Check Route
const checkVersionRoutes = require('./modules/user/appVersion/checkVersion/checkVersion.routes');
app.use('/api/app-version/check', checkVersionRoutes);

module.exports = app;
