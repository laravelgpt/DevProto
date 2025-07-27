const express = require('express');
const Skill = require('../models/Skill');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all skills (public)
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 }).lean();
    const formatted = skills.map((s) => ({ id: s._id, name: s.name, level: s.level }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new skill (admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, level } = req.body;
    const skill = await Skill.create({ name, level });
    res.status(201).json({ id: skill._id, name: skill.name, level: skill.level });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a skill (admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, level } = req.body;
    const { id } = req.params;
    const skill = await Skill.findByIdAndUpdate(
      id,
      { name, level },
      { new: true, runValidators: true }
    );
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.json({ id: skill._id, name: skill.name, level: skill.level });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a skill (admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Skill.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Skill not found' });
    res.json({ message: 'Skill deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;