const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const authRoutes = require('./server/routes/auth');
const postRoutes = require('./server/routes/posts');
const adminRoutes = require('./server/routes/admin');
const aboutRoutes = require('./server/routes/about');
const skillsRoutes = require('./server/routes/skills');
const projectRoutes = require('./server/routes/projects');
const contactRoutes = require('./server/routes/contacts');
const aiRoutes = require('./server/routes/ai');
const userRoutes = require('./server/routes/users');
const friendRoutes = require('./server/routes/friends');
const messageRoutes = require('./server/routes/messages');
const reactionRoutes = require('./server/routes/reactions');
const commentRoutes = require('./server/routes/comments');
const { verifyToken, verifyAdmin } = require('./server/middleware/auth');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Import mongoose and connect to MongoDB. Use MONGO_URI env or fallback.
const mongoose = require('mongoose');

async function start() {
  // Connect to MongoDB before preparing the app
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
  await app.prepare();
  const server = express();

  // Middleware
  server.use(bodyParser.json());

  // API routes
  server.use('/api/auth', authRoutes);
  server.use('/api/posts', postRoutes);
  server.use('/api/admin', adminRoutes);
  server.use('/api/about', aboutRoutes);
  server.use('/api/skills', skillsRoutes);
  server.use('/api/projects', projectRoutes);
  server.use('/api/contacts', contactRoutes);
  server.use('/api/ai', aiRoutes);
  server.use('/api/users', userRoutes);
  server.use('/api/friends', friendRoutes);
  server.use('/api/messages', messageRoutes);
  server.use('/api/reactions', reactionRoutes);
  server.use('/api/comments', commentRoutes);

  // Custom route to restrict access to /dev-post page based on authentication
  server.get('/dev-post', verifyToken, (req, res) => {
    return app.render(req, res, '/dev-post', req.query);
  });

  // Custom route to restrict access to the user dashboard. Any authenticated user can view their own dashboard.
  server.get('/dashboard', verifyToken, (req, res) => {
    return app.render(req, res, '/dashboard', req.query);
  });

  // Admin dashboard (list all posts)
  server.get('/admin', verifyToken, verifyAdmin, (req, res) => {
    return app.render(req, res, '/admin/index', req.query);
  });

  // Admin create post page
  server.get('/admin/posts/create', verifyToken, verifyAdmin, (req, res) => {
    return app.render(req, res, '/admin/posts/create', req.query);
  });

  // Admin edit post page (dynamic parameter)
  server.get('/admin/posts/:id', verifyToken, verifyAdmin, (req, res) => {
    return app.render(req, res, '/admin/posts/[id]', { ...req.query, id: req.params.id });
  });

  // Additional admin pages for managing content
  server.get('/admin/about', verifyToken, verifyAdmin, (req, res) => {
    return app.render(req, res, '/admin/about', req.query);
  });
  server.get('/admin/skills', verifyToken, verifyAdmin, (req, res) => {
    return app.render(req, res, '/admin/skills/index', req.query);
  });
  server.get('/admin/projects', verifyToken, verifyAdmin, (req, res) => {
    return app.render(req, res, '/admin/projects/index', req.query);
  });
  server.get('/admin/contacts', verifyToken, verifyAdmin, (req, res) => {
    return app.render(req, res, '/admin/contacts', req.query);
  });

  // Admin users page
  server.get('/admin/users', verifyToken, verifyAdmin, (req, res) => {
    return app.render(req, res, '/admin/users', req.query);
  });

  // Let Next handle all other requests
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error(err);
});