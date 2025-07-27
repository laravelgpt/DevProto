const express = require('express');
const PortfolioProject = require('../models/PortfolioProject');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all portfolio projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await PortfolioProject.find().sort({ createdAt: -1 }).lean();
    const formatted = projects.map((p) => ({ id: p._id, title: p.title, description: p.description, link: p.link }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new project (admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, description, link } = req.body;
    const project = await PortfolioProject.create({ title, description, link });
    res.status(201).json({ id: project._id, title: project.title, description: project.description, link: project.link });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a project (admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, description, link } = req.body;
    const { id } = req.params;
    const project = await PortfolioProject.findByIdAndUpdate(
      id,
      { title, description, link },
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ id: project._id, title: project.title, description: project.description, link: project.link });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a project (admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PortfolioProject.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;