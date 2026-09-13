import pg from 'pg'

const { Pool } = pg

const globalForPg = globalThis

export const pool =
  globalForPg.__kuyayPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: process.env.DATABASE_URL?.includes('localhost')
      ? false
      : { rejectUnauthorized: false },
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPg.__kuyayPool = pool
}

export async function query(text, params) {
  return pool.query(text, params)
}

export async function getClient() {
  return pool.connect()
}
