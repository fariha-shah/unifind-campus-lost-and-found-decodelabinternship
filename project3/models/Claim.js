// ============================================
// UniFind — Claim Model
// ============================================

const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
    },
    itemTitle: {
      type: String,
      required: true,
    },
    claimerName: {
      type: String,
      required: true,
    },
    claimerEmail: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Claim', claimSchema);
