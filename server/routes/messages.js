const express = require('express');
const Message = require('../models/Message');
const { verifyToken } = require('../middleware/auth');

/*
 * messages.js
 *
 * Simple chat endpoints to send and retrieve messages between users. Messages are
 * stored in a `messages` table with sender_id, receiver_id, content and timestamp.
 */

const router = express.Router();

// Get conversation with another user
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const otherId = req.params.id;
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: otherId },
        { sender: otherId, receiver: req.user.id },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();
    const formatted = messages.map((m) => ({
      id: m._id,
      sender_id: m.sender,
      receiver_id: m.receiver,
      content: m.content,
      created_at: m.createdAt,
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message to another user
router.post('/:id', verifyToken, async (req, res) => {
  try {
    const receiverId = req.params.id;
    let { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Message content required' });
    }
    // Sanitize and filter banned words (simple)
    function sanitize(str) {
      return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    const banned = ['sex', 'porn', 'nude', 'xxx', '18+'];
    const lower = content.toLowerCase();
    if (banned.some((w) => lower.includes(w))) {
      return res.status(400).json({ message: 'Message violates community guidelines.' });
    }
    content = sanitize(content);
    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content,
    });
    res.status(201).json({
      id: message._id,
      sender_id: message.sender,
      receiver_id: message.receiver,
      content: message.content,
      created_at: message.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;