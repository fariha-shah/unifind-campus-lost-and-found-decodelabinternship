// ============================================
// UniFind — Items Routes
// ============================================

const express = require('express');
const router = express.Router();

// Temporary data
const items = [
  {
    id: 1,
    title: 'iPhone 14 Pro – Space Black',
    category: 'electronics',
    status: 'lost',
    location: 'Science Block',
    date: 'June 1, 2026',
    poster: 'Ahmed K.',
    description: 'Lost near the physics lab corridor.',
  },
  {
    id: 2,
    title: 'Silver Key Bundle',
    category: 'keys',
    status: 'found',
    location: 'Cafeteria',
    date: 'June 1, 2026',
    poster: 'Sara M.',
    description: 'Found on a table near the main entrance.',
  },
  {
    id: 3,
    title: 'Navy Blue Backpack',
    category: 'bags',
    status: 'lost',
    location: 'Main Library',
    date: 'May 31, 2026',
    poster: 'Zara H.',
    description: 'Left on a study desk on the second floor.',
  },
];

// GET /api/items
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
  });
});
// GET /api/items/:id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find((i) => i.id === id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found',
    });
  }

  res.status(200).json({
    success: true,
    data: item,
  });
});
// POST /api/items
router.post('/', (req, res) => {
  const { title, category, status, location, description, poster } = req.body;

  // Validation
  if (!title || !category || !status || !location || !description) {
    return res.status(400).json({
      success: false,
      message: 'Please fill all required fields',
    });
  }

  const newItem = {
    id: items.length + 1,
    title,
    category,
    status,
    location,
    description,
    poster: poster || 'Anonymous',
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };

  items.push(newItem);

  res.status(201).json({
    success: true,
    message: 'Item reported successfully!',
    data: newItem,
  });
});
module.exports = router;
