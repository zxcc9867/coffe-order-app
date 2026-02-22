/**
 * coffe_order 데이터베이스 생성 스크립트
 * PostgreSQL이 실행 중이고 .env의 DB_USER, DB_PASSWORD가 맞아야 합니다.
 * 사용: node scripts/create-db.js
 */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const { Client } = require('pg')

const dbName = process.env.DB_NAME || 'coffe_order'

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: false,
  connectionTimeoutMillis: 5000,
})

async function main() {
  try {
    await client.connect()
    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    )
    if (res.rows.length > 0) {
      console.log(`Database "${dbName}" already exists.`)
      return
    }
    await client.query(`CREATE DATABASE "${dbName.replace(/"/g, '""')}"`)
    console.log(`Database "${dbName}" created successfully.`)
  } catch (err) {
    console.error('Error:', err.message)
    if (err.code === '28P01') {
      console.error('→ Check DB_USER and DB_PASSWORD in .env')
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('→ Make sure PostgreSQL is running (e.g. port 5432).')
    }
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
