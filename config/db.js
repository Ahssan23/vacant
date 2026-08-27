import pg from 'pg';
const { Pool } = pg;

if (!process.env.DB_HOST) {
  console.error("FATAL: DATABASE_URL environment variable is missing.");
}

const pool = new Pool({
  connectionString: process.env.DB_HOST,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
});

export default pool;
