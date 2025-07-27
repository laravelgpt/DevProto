const express = require('express');
const Reaction = require('../models/Reaction');
const { verifyToken } = require('../middleware/auth');

/*
 * reactions.js
 *
 * Provides endpoints to add and retrieve reactions on posts. Each user can
 * leave at most one reaction per post. A subsequent reaction will replace
 * the previous one. Reaction types are free‑form strings (e.g. like, love, haha).
 */

const router = express.Router();

// Get reactions for a post
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const reactions = await Reaction.find({ post: postId }).lean();
    const formatted = reactions.map((r) => ({ user_id: r.user, type: r.type }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add or update a reaction on a post
router.post('/:postId', verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { type } = req.body;
    if (!type) {
      return res.status(400).json({ message: 'Reaction type required' });
    }
    // Upsert reaction: if exists, update; else insert
    const reaction = await Reaction.findOne({ post: postId, user: req.user.id });
    if (!reaction) {
      await Reaction.create({ post: postId, user: req.user.id, type });
    } else {
      reaction.type = type;
      await reaction.save();
    }
    res.status(200).json({ message: 'Reaction saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a reaction
router.delete('/:postId', verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    await Reaction.deleteOne({ post: postId, user: req.user.id });
    res.json({ message: 'Reaction removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;