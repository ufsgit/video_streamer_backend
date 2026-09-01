const express = require('express');
const path = require('path');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

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
const editUserRoutes = require('./modules/admin/manageUsers/editUser/editUser.routes');
const deleteUserRoutes = require('./modules/admin/manageUsers/deleteUser/deleteUser.routes');

app.use('/api/admin/users/create', createUserRoutes);
app.use('/api/admin/users/list', listUsersRoutes);
app.use('/api/admin/users/edit', editUserRoutes);
app.use('/api/admin/users/delete', deleteUserRoutes);

module.exports = app;
