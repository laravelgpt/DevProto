const mongoose = require('mongoose');

const PortfolioProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.PortfolioProject || mongoose.model('PortfolioProject', PortfolioProjectSchema);