/**
 * .env 기준으로 DB 연결 테스트
 * 사용: node scripts/test-db-connection.js
 */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const { Client } = require('pg')

const dbName = (process.env.DB_NAME || 'coffe_order').trim()

const client = new Client({
  host: (process.env.DB_HOST || 'localhost').trim(),
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: dbName,
  user: (process.env.DB_USER || 'postgres').trim(),
  password: (process.env.DB_PASSWORD || '').trim(),
  ssl: false,
  connectionTimeoutMillis: 10000,
})

async function main() {
  try {
    await client.connect()
    const res = await client.query('SELECT 1 as ok')
    console.log('OK: Database connected to', dbName)
    console.log('Result:', res.rows[0])
  } catch (err) {
    console.error('Connection failed:', err.message)
    console.error('Code:', err.code)
    console.error('Config: DB_HOST=%s DB_PORT=%s DB_NAME=%s DB_USER=%s', process.env.DB_HOST, process.env.DB_PORT, dbName, process.env.DB_USER)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
