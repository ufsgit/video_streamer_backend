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

module.exports = app;
