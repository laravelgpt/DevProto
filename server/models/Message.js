const mongoose = require('mongoose');

/**
 * Message Schema
 *
 * Represents a chat message between two users. Each message stores the
 * sender and receiver along with the content. Messages are ordered by
 * their createdAt timestamp. There is no concept of read/unread in this
 * simple implementation.
 */
const MessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Message || mongoose.model('Message', MessageSchema);