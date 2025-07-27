const { Pool } = require('pg');

/*
 * db.js
 *
 * This module creates a PostgreSQL connection pool using the `pg` library and exposes a
 * simple query helper. The connection string is read from the POSTGRES_URI environment
 * variable (preferred) or falls back to a local database URI. Adjust these values to
 * point to your Postgres instance. For development, you might run a local Postgres
 * server and create a `portfolio` database and corresponding tables.
 */

// Use environment variable or default local connection
const connectionString = process.env.POSTGRES_URI || process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/portfolio';

const pool = new Pool({ connectionString });

module.exports = {
  query: (text, params) => pool.query(text, params),
};