// ============================================
// UniFind — Item Model (Schema)
// ============================================

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'electronics',
        'keys',
        'bags',
        'documents',
        'accessories',
        'clothing',
        'books',
        'other',
      ],
    },
    status: {
      type: String,
      required: true,
      enum: ['lost', 'found', 'returned'],
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    poster: {
      type: String,
      default: 'Anonymous',
    },
    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
