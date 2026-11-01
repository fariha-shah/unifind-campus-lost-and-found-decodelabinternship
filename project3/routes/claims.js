// ============================================
// UniFind — Claims Routes
// ============================================

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Claim = require('../models/Claim');
const Item = require('../models/Item');

// POST /api/claims — submit claim request
router.post('/', async (req, res) => {
  try {
    const { itemId, itemTitle, claimerName, claimerEmail, message } = req.body;

    if (!itemId || !itemTitle || !claimerName || !claimerEmail || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required to submit a claim',
      });
    }

    const claim = await Claim.create({
      itemId,
      itemTitle: itemTitle.trim(),
      claimerName: claimerName.trim(),
      claimerEmail: claimerEmail.trim().toLowerCase(),
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Claim request submitted successfully!',
      data: claim,
    });
  } catch (error) {
    console.error('Submit claim error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting claim',
    });
  }
});

// GET /api/claims — sab claims lao
router.get('/', async (req, res) => {
  try {
    const claims = await Claim.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims,
    });
  } catch (error) {
    console.error('Fetch claims error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching claims',
    });
  }
});

// PUT /api/claims/:id — approve ya reject karo
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid claim ID',
      });
    }

    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    // Agar claim approve hua hai to item ka status b automatically 'returned' set karo
    if (status === 'approved' && claim.itemId && mongoose.Types.ObjectId.isValid(claim.itemId)) {
      await Item.findByIdAndUpdate(claim.itemId, { status: 'returned' });
    }

    res.status(200).json({
      success: true,
      message: `Claim ${status} successfully!`,
      data: claim,
    });
  } catch (error) {
    console.error('Update claim error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating claim',
    });
  }
});

module.exports = router;
