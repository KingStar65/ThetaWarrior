import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,         // ✅ correct env name
  password: process.env.DB_PASSWORD,     // ✅ correct place
  port: process.env.DB_PORT
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

export { pool };
