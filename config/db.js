import pg from 'pg';
const { Pool } = pg;

// Parse or supply explicit credentials directly to the pool config object
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: 'postgresql-anonymous23.alwaysdata.net',
  port: 5432,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
