const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Helper sanitization to avoid script injections
function sanitize(str = '') {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Create a new contact message (public)
router.post('/', async (req, res) => {
  try {
    let { name, email, message } = req.body;
    const banned = ['sex', 'porn', 'nude', 'xxx', '18+'];
    const lower = (message || '').toLowerCase();
    if (banned.some((w) => lower.includes(w))) {
      return res.status(400).json({ message: 'Message violates community guidelines.' });
    }
    name = sanitize(name);
    email = sanitize(email);
    message = sanitize(message);
    await ContactMessage.create({ name, email, message });
    res.status(201).json({ message: 'Message received' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all contact messages (admin only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    const formatted = messages.map((m) => ({ id: m._id, name: m.name, email: m.email, message: m.message, created_at: m.createdAt }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a contact message (admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ContactMessage.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;