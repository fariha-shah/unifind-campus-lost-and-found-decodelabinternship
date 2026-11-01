// ============================================
// UniFind — Messages Routes
// ============================================

const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// GET /api/messages/:itemId — item ki saari chat history
router.get('/:itemId', async (req, res) => {
  try {
    const messages = await Message.find({ itemId: req.params.itemId }).sort({
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Fetch messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching messages',
    });
  }
});

// POST /api/messages — naya chat message save karo
router.post('/', async (req, res) => {
  try {
    const { itemId, sender, text, type } = req.body;

    if (!itemId || !sender || !text || !type) {
      return res.status(400).json({
        success: false,
        message: 'itemId, sender, text, and type are all required',
      });
    }

    const message = await Message.create({
      itemId,
      sender: sender.trim(),
      text: text.trim(),
      type,
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('Save message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving message',
    });
  }
});

module.exports = router;
