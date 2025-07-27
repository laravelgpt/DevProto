const bcrypt = require('bcryptjs');
const db = require('./db');

/*
 * seed.js
 *
 * A simple seed script to populate the PostgreSQL database with sample users,
 * posts, skills, projects and about content. Run this script manually via
 * `node server/seed.js` after configuring your POSTGRES_URI in the environment.
 */

async function seed() {
  try {
    // Clear existing data (optional)
    await db.query('DELETE FROM reactions');
    await db.query('DELETE FROM friends');
    await db.query('DELETE FROM messages');
    await db.query('DELETE FROM posts');
    await db.query('DELETE FROM skills');
    await db.query('DELETE FROM portfolio_projects');
    await db.query('DELETE FROM contact_messages');
    await db.query('DELETE FROM about');
    await db.query('DELETE FROM users');

    // Create sample users
        // Create sample users with more realistic data
    const password = await bcrypt.hash('password', 10);
    const admin = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Admin User', 'admin@example.com', password, 'admin']
    );
    const user1 = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Sarah Johnson', 'sarah.j@example.com', password, 'user']
    );
    const user2 = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Mike Wilson', 'mike.w@example.com', password, 'user']
    );

    // Insert about content with more detailed information
    await db.query('INSERT INTO about (content) VALUES ($1)', [
      '<div class="about-content">'
      + '<h2>About Me</h2>'
      + '<p>I am a passionate full-stack developer with expertise in modern web technologies. With over 5 years of experience, I specialize in building scalable and maintainable applications using React, Node.js, and MongoDB.</p>'
      + '<h3>Professional Experience</h3>'
      + '<ul>'
      + '<li>Senior Developer at TechCorp (2022 - Present)</li>'
      + '<li>Full Stack Developer at WebSolutions (2020 - 2022)</li>'
      + '<li>Junior Developer at CodeCraft (2018 - 2020)</li>'
      + '</ul>'
      + '</div>'
    ]);

    // Insert skills with more comprehensive list
    await db.query('INSERT INTO skills (name, level) VALUES ($1, $2), ($3, $4), ($5, $6), ($7, $8), ($9, $10), ($11, $12), ($13, $14), ($15, $16), ($17, $18), ($19, $20)', [
      'JavaScript', 95,
      'React', 90,
      'Next.js', 85,
      'Node.js', 88,
      'Express.js', 82,
      'MongoDB', 80,
      'TypeScript', 75,
      'Tailwind CSS', 85,
      'Git', 90,
      'REST APIs', 88,
      'PostgreSQL', 70,
    ]);

    // Insert portfolio projects with detailed information
    await db.query('INSERT INTO portfolio_projects (title, description, technologies, image_url, github_url, live_url) VALUES ($1, $2, $3, $4, $5, $6)', [
      'E-commerce Platform',
      'A full-featured e-commerce platform with user authentication, product management, and payment integration',
      'Next.js, React, Node.js, MongoDB, Stripe',
      'https://example.com/ecommerce.png',
      'https://github.com/example/ecommerce',
      'https://ecommerce-platform.com'
    ]);
    
    await db.query('INSERT INTO portfolio_projects (title, description, technologies, image_url, github_url, live_url) VALUES ($1, $2, $3, $4, $5, $6)', [
      'Task Management App',
      'A collaborative task management application with real-time updates and team collaboration features',
      'React, Node.js, Socket.io, MongoDB',
      'https://example.com/task-manager.png',
      'https://github.com/example/task-manager',
      'https://task-manager.com'
    ]);
    
    await db.query('INSERT INTO portfolio_projects (title, description, technologies, image_url, github_url, live_url) VALUES ($1, $2, $3, $4, $5, $6)', [
      'Blog Platform',
      'A content management system for managing blog posts with rich text editing and media support',
      'Next.js, React, Node.js, MongoDB, TinyMCE',
      'https://example.com/blog.png',
      'https://github.com/example/blog',
      'https://blog-platform.com'
    ]);

    // Insert posts
    await db.query(
      'INSERT INTO posts (title, content, author) VALUES ($1, $2, $3), ($4, $5, $6)',
      [
        'Welcome to the feed',
        'This is the first post in the feed. Feel free to add more!',
        user1.rows[0].id,
        'Another Post',
        'Bob shares his second post here.',
        user2.rows[0].id,
      ]
    );
    console.log('Database seeded successfully');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    process.exit();
  }
}

seed();