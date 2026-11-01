// ============================================
// UniFind — Auth Routes
// ============================================

const express = require('express');
const router = express.Router();

// Temporary users data
const users = [];

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email and password are required',
    });
  }

  if (!email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters',
    });
  }

  // Check if user already exists
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email',
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'Registration successful!',
    data: { id: newUser.id, name, email },
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Login successful!',
    data: { id: user.id, name: user.name, email: user.email },
  });
});

module.exports = router;
