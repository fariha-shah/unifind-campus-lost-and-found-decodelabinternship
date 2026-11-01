// ============================================
// UniFind — Contact Routes
// ============================================

const express = require('express');
const router = express.Router();

// POST /api/contact — message bhejo
router.post('/', (req, res) => {
  const { name, email, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email and message are required',
    });
  }

  if (!email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email',
    });
  }

  if (message.length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Message must be at least 10 characters',
    });
  }

  res.status(201).json({
    success: true,
    message: 'Message sent successfully!',
    data: { name, email, message },
  });
});

module.exports = router;
