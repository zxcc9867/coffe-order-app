/**
 * .env 기준으로 DB 연결 테스트 (db.js와 동일한 설정 사용)
 * 사용: node scripts/test-db-connection.js
 */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const { testConnection } = require('../src/db')

async function main() {
  const ok = await testConnection()
  if (ok) {
    console.log('OK: Database connected.')
    process.exit(0)
  } else {
    console.error('Connection failed. Check .env (DATABASE_URL or DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)')
    process.exit(1)
  }
}

main()
