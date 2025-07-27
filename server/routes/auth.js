const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_key';

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    // Simple password breach/strength check
    const commonPasswords = [
      'password',
      '123456',
      '123456789',
      'qwerty',
      '111111',
      'abc123',
      '12345',
      'password1',
    ];
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (
      password.length < 8 ||
      !hasLower ||
      !hasUpper ||
      !hasNumber ||
      commonPasswords.includes(password.toLowerCase())
    ) {
      return res.status(400).json({ message: 'Password too weak or commonly used; use at least 8 characters with uppercase, lowercase and numbers.' });
    }
    // Create user; password hashing handled in pre-save hook
    const user = new User({
      name,
      email,
      password,
      role: 'user',
    });
    await user.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Fetch user from DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;