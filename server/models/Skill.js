const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    level: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);