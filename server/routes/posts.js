const express = require('express');
const Post = require('../models/Post');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Helper to sanitize text by escaping angle brackets
function sanitize(str = '') {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const bannedWords = ['sex', 'porn', 'nude', 'xxx', '18+'];

// Get all posts (accessible to logged in users)
router.get('/', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: 'author', select: 'name' })
      .lean();
    const formatted = posts.map((p) => ({
      id: p._id,
      title: p.title,
      content: p.content,
      created_at: p.createdAt,
      updated_at: p.updatedAt,
      author: p.author ? { id: p.author._id, name: p.author.name } : null,
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search posts by query string (title or content)
router.get('/search', verifyToken, async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      // Return all posts if empty search
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate({ path: 'author', select: 'name' })
        .lean();
      const formattedAll = posts.map((p) => ({
        id: p._id,
        title: p.title,
        content: p.content,
        created_at: p.createdAt,
        updated_at: p.updatedAt,
        author: p.author ? { id: p.author._id, name: p.author.name } : null,
      }));
      return res.json(formattedAll);
    }
    const regex = new RegExp(q, 'i');
    const posts = await Post.find({ $or: [{ title: regex }, { content: regex }] })
      .sort({ createdAt: -1 })
      .populate({ path: 'author', select: 'name' })
      .lean();
    const formatted = posts.map((p) => ({
      id: p._id,
      title: p.title,
      content: p.content,
      created_at: p.createdAt,
      updated_at: p.updatedAt,
      author: p.author ? { id: p.author._id, name: p.author.name } : null,
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create post (authenticated users can create posts)
router.post('/', verifyToken, async (req, res) => {
  try {
    let { title, content } = req.body;
    // Require at least some content
    if (!title && !content) {
      return res.status(400).json({ message: 'Post cannot be empty' });
    }
    const lower = (content || '').toLowerCase();
    if (bannedWords.some((w) => lower.includes(w))) {
      return res.status(400).json({ message: 'Content violates community guidelines.' });
    }
    content = sanitize(content || '');
    if (!title) {
      title = content.slice(0, 50);
    }
    title = sanitize(title);
    const post = await Post.create({ title, content, author: req.user.id });
    // Populate author for response consistency
    await post.populate('author', 'name');
    res.status(201).json({
      id: post._id,
      title: post.title,
      content: post.content,
      created_at: post.createdAt,
      updated_at: post.updatedAt,
      author: { id: post.author._id, name: post.author.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single post
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate({ path: 'author', select: 'name' });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({
      id: post._id,
      title: post.title,
      content: post.content,
      created_at: post.createdAt,
      updated_at: post.updatedAt,
      author: post.author ? { id: post.author._id, name: post.author.name } : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update post (admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    let { title, content } = req.body;
    const { id } = req.params;
    const lower = (content || '').toLowerCase();
    if (bannedWords.some((w) => lower.includes(w))) {
      return res.status(400).json({ message: 'Content violates community guidelines.' });
    }
    content = sanitize(content || '');
    title = sanitize(title || '');
    const post = await Post.findByIdAndUpdate(
      id,
      { title, content },
      { new: true, runValidators: true }
    ).populate({ path: 'author', select: 'name' });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({
      id: post._id,
      title: post.title,
      content: post.content,
      created_at: post.createdAt,
      updated_at: post.updatedAt,
      author: post.author ? { id: post.author._id, name: post.author.name } : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post (admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Post.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;