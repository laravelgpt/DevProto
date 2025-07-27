const express = require('express');
const Friend = require('../models/Friend');
const User = require('../models/User');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

/*
 * friends.js
 *
 * Provides endpoints for friend requests and friendships. Users can send
 * requests, accept or reject them, and list friends. The schema for friends
 * is assumed to have columns: id, user_id, friend_id, status (pending/accepted).
 */

const router = express.Router();

// Send a friend request to another user
router.post('/request/:id', verifyToken, async (req, res) => {
  try {
    const targetId = req.params.id;
    if (req.user.id.toString() === targetId.toString()) {
      return res.status(400).json({ message: 'Cannot send request to yourself' });
    }
    // Check if a request or friendship already exists (either direction)
    const existing = await Friend.findOne({
      $or: [
        { user: req.user.id, friend: targetId },
        { user: targetId, friend: req.user.id },
      ],
    });
    if (existing) {
      return res.status(400).json({ message: 'Friend request already exists' });
    }
    await Friend.create({
      user: req.user.id,
      friend: targetId,
      status: 'pending',
    });
    res.status(201).json({ message: 'Friend request sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept a friend request
router.post('/accept/:id', verifyToken, async (req, res) => {
  try {
    const requesterId = req.params.id;
    // Update existing pending request
    const request = await Friend.findOneAndUpdate(
      { user: requesterId, friend: req.user.id, status: 'pending' },
      { status: 'accepted' },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }
    // Create reciprocal relationship
    await Friend.create({
      user: req.user.id,
      friend: requesterId,
      status: 'accepted',
    });
    res.json({ message: 'Friend request accepted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending friend requests for current user
router.get('/pending', verifyToken, async (req, res) => {
  try {
    const pending = await Friend.find({ friend: req.user.id, status: 'pending' })
      .populate({ path: 'user', select: 'name email' })
      .lean();
    const formatted = pending.map((p) => ({
      id: p.user._id,
      name: p.user.name,
      email: p.user.email,
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List friends of current user (accepted)
router.get('/', verifyToken, async (req, res) => {
  try {
    const friends = await Friend.find({ user: req.user.id, status: 'accepted' })
      .populate({ path: 'friend', select: 'name email' })
      .lean();
    const formatted = friends.map((f) => ({
      id: f.friend._id,
      name: f.friend.name,
      email: f.friend.email,
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;