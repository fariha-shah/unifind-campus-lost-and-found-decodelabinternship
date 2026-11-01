// ============================================
// UniFind — Items Routes with Database
// ============================================

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Item = require('../models/Item');

// Image storage setup
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const isValid = allowed.test(path.extname(file.originalname).toLowerCase());
    if (isValid) cb(null, true);
    else cb(new Error('Only JPEG, PNG and WEBP images are allowed!'));
  },
});

// GET /api/items — sab items lao (supports category, status, query search)
router.get('/', async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Item.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error('Fetch items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching items',
    });
  }
});

// GET /api/items/:id — ek item lao
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid item ID or item not found',
      });
    }

    const item = await Item.findById(req.params.id);
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
  } catch (error) {
    console.error('Fetch single item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching item',
    });
  }
});

// POST /api/items — add new item with optional image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, category, status, location, description, poster } = req.body;

    if (!title || !category || !status || !location || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields',
      });
    }

    const item = await Item.create({
      title: title.trim(),
      category,
      status,
      location: location.trim(),
      description: description.trim(),
      poster: poster ? poster.trim() : 'Anonymous',
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json({
      success: true,
      message: 'Item added successfully!',
      data: item,
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while adding item',
    });
  }
});

// DELETE /api/items/:id — delete item and optional uploaded image
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid item ID or item not found',
      });
    }

    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Try deleting the associated uploaded image file if present
    if (item.image) {
      const filePath = path.join(__dirname, '..', item.image);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn('Could not delete image file:', e.message);
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully!',
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting item',
    });
  }
});

module.exports = router;
