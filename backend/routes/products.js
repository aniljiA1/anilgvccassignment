const express = require('express');
const router = express.Router();
const { get, all } = require('../db');

// GET /api/products?search=&category=&page=&limit=
router.get('/', async (req, res) => {
  try {
    const { search = '', category = '', page = 1, limit = 6 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const perPage = Math.max(1, parseInt(limit, 10) || 6);
    const offset = (pageNum - 1) * perPage;

    const whereClauses = [];
    const params = [];

    // Add search filter only if search term exists
    if (search.trim() !== '') {
      whereClauses.push('(LOWER(name) LIKE ? OR LOWER(short_desc) LIKE ?)');
      const searchTerm = `%${search.toLowerCase()}%`;
      params.push(searchTerm, searchTerm);
    }

    // Add category filter only if category exists
    if (category.trim() !== '') {
      whereClauses.push('LOWER(category) LIKE ?');
      params.push(`%${category.toLowerCase()}%`);
    }

    const where = whereClauses.length
      ? 'WHERE ' + whereClauses.join(' AND ')
      : '';

    // Total rows for pagination
    const totalRow = await get(
      `SELECT COUNT(*) as count FROM products ${where}`,
      params
    );
    const total = totalRow?.count || 0;

    // Paginated products
    const rows = await all(
      `SELECT id, name, category, short_desc, price, image_url
       FROM products
       ${where}
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
        totalPages: Math.ceil(total / perPage)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const product = await get('SELECT * FROM products WHERE id = ?', [id]);
    if (!product)
      return res.status(404).json({ error: 'Product not found' });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
