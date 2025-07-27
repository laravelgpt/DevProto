const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { verifyToken } = require('../middleware/auth');

/*
 * comments.js
 *
 * Provides endpoints for creating, listing and deleting comments associated
 * with posts. Comments are stored in MongoDB via Mongoose and reference
 * both the post and the author (user) who created them.
 */

const router = express.Router();

// Get all comments for a specific post (public)
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: 1 })
      .populate({ path: 'author', select: 'name' })
      .lean();
    const formatted = comments.map((c) => ({
      id: c._id,
      postId: c.post,
      author: c.author ? { id: c.author._id, name: c.author.name } : null,
      content: c.content,
      created_at: c.createdAt,
      updated_at: c.updatedAt,
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new comment on a post (authenticated)
router.post('/:postId', verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    let { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Comment content required' });
    }
    // Simple sanitization and banned words check
    function sanitize(str) {
      return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    const banned = ['sex', 'porn', 'nude', 'xxx', '18+'];
    const lower = content.toLowerCase();
    if (banned.some((w) => lower.includes(w))) {
      return res.status(400).json({ message: 'Comment violates community guidelines.' });
    }
    content = sanitize(content);
    // Ensure post exists
    const post = await Post.findById(postId).lean();
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const comment = await Comment.create({
      post: postId,
      author: req.user.id,
      content,
    });
    res.status(201).json({
      id: comment._id,
      postId: comment.post,
      author: { id: req.user.id, name: req.user.name },
      content: comment.content,
      created_at: comment.createdAt,
      updated_at: comment.updatedAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a comment (author or admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    // Check if current user is the author or admin
    if (comment.author.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;