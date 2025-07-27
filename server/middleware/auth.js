const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_key';

// Verify JWT token middleware
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Fetch user from MongoDB by id, omitting password
    const user = await User.findById(decoded.id).select('id name email role');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    // For consistency with previous PG implementation, convert Mongoose document
    // into a plain JS object and rename _id to id
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Verify admin role
function verifyAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Admins only' });
}

module.exports = { verifyToken, verifyAdmin };