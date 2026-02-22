const express = require('express')
const { query } = require('../db')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, base_price AS "basePrice", description, options FROM menus ORDER BY id'
    )
    const menus = result.rows.map((r) => ({
      ...r,
      options: typeof r.options === 'string' ? JSON.parse(r.options) : r.options,
    }))
    res.json(menus)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch menus' })
  }
})

module.exports = router
