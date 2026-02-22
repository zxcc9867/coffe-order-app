const express = require('express')
const { query, pool } = require('../db')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const ordersResult = await query(
      'SELECT id, created_at AS "createdAt", total, status FROM orders ORDER BY created_at DESC'
    )
    const orders = []
    for (const row of ordersResult.rows) {
      const itemsResult = await query(
        'SELECT name, option_labels AS "optionLabels", quantity, unit_price AS "unitPrice" FROM order_items WHERE order_id = $1',
        [row.id]
      )
      const items = itemsResult.rows.map((i) => ({
        ...i,
        optionLabels: Array.isArray(i.optionLabels) ? i.optionLabels : (i.optionLabels && JSON.parse(i.optionLabels)) || [],
      }))
      orders.push({
        id: String(row.id),
        createdAt: row.createdAt,
        total: row.total,
        status: row.status,
        items,
      })
    }
    res.json(orders)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

router.get('/stats', async (req, res) => {
  try {
    const result = await query(`
      SELECT status, COUNT(*) AS count FROM orders GROUP BY status
    `)
    const counts = { total: 0, received: 0, making: 0, done: 0 }
    const totalResult = await query('SELECT COUNT(*) AS count FROM orders')
    counts.total = parseInt(totalResult.rows[0].count, 10)
    result.rows.forEach((r) => {
      counts[r.status] = parseInt(r.count, 10)
    })
    res.json(counts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

router.post('/', async (req, res) => {
  const client = await pool.connect()
  try {
    const { items = [], total } = req.body
    if (!Array.isArray(items) || items.length === 0 || total == null) {
      return res.status(400).json({ error: 'items and total required' })
    }
    await client.query('BEGIN')
    const orderResult = await client.query(
      'INSERT INTO orders (total, status) VALUES ($1, $2) RETURNING id, created_at AS "createdAt", total, status',
      [total, 'received']
    )
    const order = orderResult.rows[0]
    for (const it of items) {
      await client.query(
        'INSERT INTO order_items (order_id, name, option_labels, quantity, unit_price) VALUES ($1, $2, $3, $4, $5)',
        [
          order.id,
          it.name,
          JSON.stringify(it.optionLabels || []),
          it.quantity,
          it.unitPrice,
        ]
      )
    }
    await client.query('COMMIT')
    res.status(201).json({
      id: String(order.id),
      createdAt: order.createdAt,
      total: order.total,
      status: order.status,
    })
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error(err)
    res.status(500).json({ error: 'Failed to create order' })
  } finally {
    client.release()
  }
})

router.patch('/:id', async (req, res) => {
  const client = await pool.connect()
  try {
    const { id } = req.params
    const { status } = req.body
    if (!['received', 'making', 'done'].includes(status)) {
      return res.status(400).json({ error: 'status must be received, making, or done' })
    }
    await client.query('BEGIN')
    const result = await client.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, created_at AS "createdAt", total, status',
      [status, id]
    )
    if (result.rows.length === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: 'Order not found' })
    }
    const order = result.rows[0]
    if (status === 'done') {
      const itemsResult = await client.query(
        'SELECT name, quantity FROM order_items WHERE order_id = $1',
        [id]
      )
      for (const it of itemsResult.rows) {
        const menuRow = await client.query('SELECT id FROM menus WHERE name = $1', [it.name])
        const menuId = menuRow.rows[0]?.id
        if (menuId) {
          await client.query(
            'UPDATE stock SET stock = stock - $1 WHERE menu_id = $2',
            [it.quantity, menuId]
          )
        }
      }
    }
    await client.query('COMMIT')
    const itemsResult = await query(
      'SELECT name, option_labels AS "optionLabels", quantity, unit_price AS "unitPrice" FROM order_items WHERE order_id = $1',
      [id]
    )
    const items = itemsResult.rows.map((i) => ({
      ...i,
      optionLabels: Array.isArray(i.optionLabels) ? i.optionLabels : [],
    }))
    res.json({ ...order, id: String(order.id), items })
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error(err)
    res.status(500).json({ error: 'Failed to update order' })
  } finally {
    client.release()
  }
})

module.exports = router
