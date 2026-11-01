// ============================================
// UniFind — Production-Ready Express Server
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// CORS Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads static directory
app.use('/uploads', express.static(uploadDir));

// Health check endpoint (for deployment platforms like Render / Railway / UptimeRobot)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root API info
app.get('/api', (req, res) => {
  res.json({
    name: 'UniFind API',
    version: '1.0.0',
    description: 'Campus Lost & Found System REST API',
    endpoints: {
      items: '/api/items',
      auth: '/api/auth',
      messages: '/api/messages',
      claims: '/api/claims',
      health: '/api/health',
    },
  });
});

// API Routes
app.use('/api/items', require('./routes/items'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/claims', require('./routes/claims'));

// Optionally serve frontend files directly from this server
// (Perfect for 1-click cloud deployments on Render / Railway)
const frontendPath = path.join(__dirname, '../project1');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  // Serve frontend index.html on root if not accessing API
  app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'UniFind API is running successfully!',
      status: 'OK',
      documentation: '/api',
    });
  });
}

// 404 handler for undefined API routes (Express 5 compatible)
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` UniFind Server running on port ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`===============================================`);
});

module.exports = app;
