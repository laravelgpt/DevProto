const mongoose = require('mongoose');

/**
 * Friend Schema
 *
 * Represents a friendship or friend request between two users. The `user`
 * field is the owner of the relationship and the `friend` field is the
 * target of the relationship. The `status` indicates whether the request
 * is still pending or has been accepted. Only one document should exist
 * per direction of the relationship – once a request is accepted, a
 * reciprocal document is created so that both users show up in each
 * other’s friends list.
 */
const FriendSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    friend: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
  },
  { timestamps: true }
);

// Ensure a user cannot have duplicate friend relationships in the same direction
FriendSchema.index({ user: 1, friend: 1 }, { unique: true });

module.exports = mongoose.models.Friend || mongoose.model('Friend', FriendSchema);