const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Router for admin‑specific statistics and endpoints
const router = express.Router();

// Get statistics for admin dashboard
// Returns total user count and total post count
router.get('/stats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    res.json({ userCount, postCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;