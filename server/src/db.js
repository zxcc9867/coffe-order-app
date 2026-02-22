const { Pool } = require('pg')

const dbName = (process.env.DB_NAME || 'coffe_order').trim()

const config = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }
  : {
      host: (process.env.DB_HOST || 'localhost').trim(),
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: dbName,
      user: (process.env.DB_USER || 'postgres').trim(),
      password: (process.env.DB_PASSWORD || '').trim(),
      ssl: false,
      connectionTimeoutMillis: 10000,
    }

const pool = new Pool(config)

pool.on('error', (err) => {
  console.error('Unexpected database error:', err.message)
})

async function query(text, params) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

async function testConnection() {
  try {
    const res = await query('SELECT 1 as ok')
    return res.rows[0].ok === 1
  } catch (err) {
    console.error('Database connection failed:', err.message)
    console.error('  code:', err.code, '| check .env (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)')
    return false
  }
}

module.exports = { pool, query, testConnection }
