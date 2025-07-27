const express = require('express');
const { verifyToken } = require('../middleware/auth');

/*
 * AI routes
 *
 * This route simulates an AI-generated post by returning one of several predefined
 * text snippets. In a production environment, you could integrate with an
 * external AI service (e.g., OpenAI) here instead of using static samples.
 */

const router = express.Router();

const samplePosts = [
  'Exploring the cosmos of code: today I built a galaxy of components with Next.js and Express!',
  'When JavaScript meets hyperspace, you get a fast, futuristic web app. Let’s travel together!',
  'My developer journey this week: turning coffee into code and dreams into deployment.',
  'Unlocking the mysteries of Postgres and JWTs on a quest to build a secure, scalable API.',
  'From zero to launch: how I built a cosmic UI that glows like a nebula in the night sky.',
];

// Generate a random AI post content
router.get('/generate', verifyToken, (req, res) => {
  const content = samplePosts[Math.floor(Math.random() * samplePosts.length)];
  res.json({ content });
});

module.exports = router;