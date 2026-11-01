// ============================================
// UniFind — Message Model
// ============================================

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['sent', 'received'],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
