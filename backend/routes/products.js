const express = require('express');
const router = express.Router();
const { get, all } = require('../db');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { search = '', category = '', page = 1, limit = 6 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const perPage = Math.max(1, parseInt(limit));
    const offset = (pageNum - 1) * perPage;

    const where = [];
    const params = [];

    if (search.trim()) {
      where.push('(LOWER(name) LIKE ? OR LOWER(short_desc) LIKE ?)');
      params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
    }

    if (category.trim()) {
      where.push('LOWER(category) LIKE ?');
      params.push(`%${category.toLowerCase()}%`);
    }

    const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

    const total = (await get(`SELECT COUNT(*) as count FROM products ${whereClause}`, params)).count;

    const rows = await all(
      `SELECT id, name, category, short_desc, price, image_url
       FROM products
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, perPage, offset]
    );

    res.json({
      data: rows,
      pagination: {
        page: pageNum,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await get('SELECT * FROM products WHERE id = ?', [
      req.params.id,
    ]);
    if (!product) return res.status(404).json({ error: 'Not found' });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
