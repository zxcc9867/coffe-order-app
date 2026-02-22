const express = require('express')
const { testConnection } = require('./db')
const menusRouter = require('./routes/menus')
const ordersRouter = require('./routes/orders')
const stockRouter = require('./routes/stock')

const app = express()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/menus', menusRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/stock', stockRouter)

app.get('/', (req, res) => {
  res.type('html').send(`
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><title>COZY API</title></head>
      <body style="font-family:sans-serif; padding:2rem;">
        <h1>COZY 커피 주문 API 서버</h1>
        <p>이 주소(3000번 포트)는 <strong>백엔드 API 전용</strong>입니다. 화면이 보이는 앱은 프론트엔드에서 실행하세요.</p>
        <ul>
          <li><a href="/api/health">/api/health</a> - 서버 상태</li>
          <li><a href="/api/health/db">/api/health/db</a> - DB 연결 상태</li>
        </ul>
        <p><strong>주문 화면 보기:</strong> <code>ui</code> 폴더에서 <code>npm run dev</code> 실행 후 브라우저에서 <a href="http://localhost:5173">http://localhost:5173</a> 접속</p>
      </body>
    </html>
  `)
})

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'COZY server is running' })
})

app.get('/api/health/db', async (req, res) => {
  const timeoutMs = 5000
  let dbOk = false
  let message = 'Database connection failed'

  try {
    const result = await Promise.race([
      testConnection(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), timeoutMs)
      ),
    ])
    dbOk = result === true
    message = dbOk ? 'Database connected' : 'Database connection failed'
  } catch (err) {
    message =
      err.message === 'timeout'
        ? 'Database connection timeout (check PostgreSQL is running and .env)'
        : 'Database connection failed'
  }

  res.status(dbOk ? 200 : 503).json({ ok: dbOk, message })
})

module.exports = app
