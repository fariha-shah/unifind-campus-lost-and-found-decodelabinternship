// ============================================
// UniFind Backend Server
// ============================================

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'UniFind API is running!',
    status: 'OK',
  });
});
// Routes
const itemsRoute = require('./routes/items');
app.use('/api/items', itemsRoute);
const contactRoute = require('./routes/contact');
app.use('/api/contact', contactRoute);
const authRoute = require('./routes/auth');
app.use('/api/auth', authRoute);
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
