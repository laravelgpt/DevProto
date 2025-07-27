const mongoose = require('mongoose');

/**
 * Reaction Schema
 *
 * Represents a reaction (like, love, haha, etc.) that a user leaves on a
 * specific post. Each user can have at most one reaction per post. The
 * `type` field stores the type of reaction. An index ensures uniqueness
 * for the combination of post and user.
 */
const ReactionSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

// Each user can react only once per post
ReactionSchema.index({ post: 1, user: 1 }, { unique: true });

module.exports = mongoose.models.Reaction || mongoose.model('Reaction', ReactionSchema);