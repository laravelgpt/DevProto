const express = require('express');
const About = require('../models/About');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Get the about section content (public)
// Returns the most recently updated about document or an empty object if none exists.
router.get('/', async (req, res) => {
  try {
    // Fetch the latest about document based on updatedAt timestamp
    const about = await About.findOne().sort({ updatedAt: -1 }).lean();
    if (!about) {
      return res.json({});
    }
    // Map to fields expected by front‑end
    res.json({ id: about._id, content: about.content, created_at: about.createdAt, updated_at: about.updatedAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update the about section (admin only)
router.put('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    // Find any existing about document
    let about = await About.findOne();
    if (!about) {
      // Create a new document if none exists
      about = await About.create({ content });
    } else {
      about.content = content;
      await about.save();
    }
    res.json({ id: about._id, content: about.content, created_at: about.createdAt, updated_at: about.updatedAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;