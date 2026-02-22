/**
 * DB 테이블 생성 및 시드 데이터
 * 사용: node scripts/init-db.js
 */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const { query, pool } = require('../src/db')

async function run() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS menus (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        base_price INTEGER NOT NULL,
        description TEXT,
        options JSONB DEFAULT '[]'
      )
    `)
    console.log('Table menus OK')

    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        total INTEGER NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'received'
      )
    `)
    console.log('Table orders OK')

    await query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        option_labels JSONB DEFAULT '[]',
        quantity INTEGER NOT NULL,
        unit_price INTEGER NOT NULL
      )
    `)
    console.log('Table order_items OK')

    await query(`
      CREATE TABLE IF NOT EXISTS stock (
        menu_id VARCHAR(50) PRIMARY KEY REFERENCES menus(id) ON DELETE CASCADE,
        stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0)
      )
    `)
    console.log('Table stock OK')

    const menuCount = await query('SELECT COUNT(*) FROM menus')
    if (parseInt(menuCount.rows[0].count, 10) === 0) {
      const options = [
        { id: 'shot', label: '샷 추가', addPrice: 500 },
        { id: 'syrup', label: '시럽 추가', addPrice: 0 },
      ]
      await query(
        `INSERT INTO menus (id, name, base_price, description, options) VALUES
         ($1, $2, $3, $4, $5),
         ($6, $7, $8, $9, $10),
         ($11, $12, $13, $14, $15),
         ($16, $17, $18, $19, $20),
         ($21, $22, $23, $24, $25)`,
        [
          'americano-ice', '아메리카노(ICE)', 4000, '에스프레소에 찬물과 얼음을 더한 시원한 아메리카노', JSON.stringify(options),
          'americano-hot', '아메리카노(HOT)', 4000, '에스프레소에 뜨거운 물을 더한 클래식 아메리카노', JSON.stringify(options),
          'caffe-latte', '카페라떼', 5000, '에스프레소와 스팀 밀크의 조화', JSON.stringify(options),
          'vanilla-latte', '바닐라 라떼', 5500, '바닐라 시럽이 들어간 부드러운 라떼', JSON.stringify(options),
          'cold-brew', '콜드브루', 4500, '차가운 물로 긴 시간 추출한 깔끔한 커피', JSON.stringify(options),
        ]
      )
      console.log('Menus seeded')

      await query(
        `INSERT INTO stock (menu_id, stock) VALUES ($1, $2), ($3, $4), ($5, $6)
         ON CONFLICT (menu_id) DO UPDATE SET stock = EXCLUDED.stock`,
        ['americano-ice', 10, 'americano-hot', 10, 'caffe-latte', 10]
      )
      console.log('Stock seeded (americano-ice, americano-hot, caffe-latte = 10 each)')
    } else {
      console.log('Menus already seeded, skip')
    }

    console.log('Init DB done.')
  } catch (err) {
    console.error(err)
    process.exit(1)
  } finally {
    await pool.end()
    process.exit(0)
  }
}

run()
