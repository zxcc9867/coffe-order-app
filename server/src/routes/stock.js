const express = require('express')
const { query } = require('../db')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT menu_id AS "menuId", stock FROM stock ORDER BY menu_id'
    )
    const stock = {}
    result.rows.forEach((r) => {
      stock[r.menuId] = r.stock
    })
    res.json(stock)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch stock' })
  }
})

router.patch('/', async (req, res) => {
  try {
    const { menuId, stock: newStock } = req.body
    if (!menuId || newStock == null) {
      return res.status(400).json({ error: 'menuId and stock required' })
    }
    const stock = Math.max(0, parseInt(newStock, 10))
    await query(
      'INSERT INTO stock (menu_id, stock) VALUES ($1, $2) ON CONFLICT (menu_id) DO UPDATE SET stock = $2',
      [menuId, stock]
    )
    const result = await query('SELECT menu_id AS "menuId", stock FROM stock WHERE menu_id = $1', [menuId])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update stock' })
  }
})

module.exports = router
