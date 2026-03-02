import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL?.trim()) {
  throw new Error(
    'DATABASE_URL is missing. Add it to your .env file (e.g. from Neon: postgresql://user:pass@host/dbname?sslmode=require)'
  );
}

const sql = neon(DATABASE_URL);

/** Quick health check – use in a route or on startup to verify DB is reachable */
export async function checkConnection() {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (err) {
    console.error('Database connection failed:', err?.message ?? err);
    return false;
  }
}

export default sql;