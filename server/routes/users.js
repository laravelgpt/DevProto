const express = require('express');
const User = require('../models/User');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

/*
 * users.js
 *
 * Provides user-related routes. Admins can list all users. Authenticated users
 * can fetch their own profile.
 */

const router = express.Router();

// Get current user profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    // req.user is populated by verifyToken middleware
    res.json(req.user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: 1 }).select('name email role').lean();
    // Format response to include id field
    const formatted = users.map((u) => ({ id: u._id, name: u.name, email: u.email, role: u.role }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;