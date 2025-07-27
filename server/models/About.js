const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.About || mongoose.model('About', AboutSchema);