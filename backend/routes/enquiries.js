const express = require('express');
const router = express.Router();
const { run, get, all } = require('../db');
const { body, validationResult } = require('express-validator');

// POST /api/enquiries
router.post(
  '/',
  [
    body('product_id').isInt().withMessage('product_id required'),
    body('name').trim().notEmpty().withMessage('name required'),
    body('email').isEmail().withMessage('valid email required'),
    body('message').trim().notEmpty().withMessage('message required'),
    body('phone').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { product_id, name, email, phone = null, message } = req.body;

    try {
      const info = await run(
        `INSERT INTO enquiries (product_id, name, email, phone, message, created_at)
         VALUES (?, ?, ?, ?, ?, datetime('now'))`,
        [product_id, name, email, phone, message]
      );
      res.status(201).json({ id: info.lastID });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// GET /api/enquiries (admin)
router.get('/', async (req, res) => {
  const token = req.header('x-admin-token') || '';
  if (process.env.ADMIN_TOKEN && token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const rows = await all(
      `SELECT e.id, e.product_id, p.name as product_name, e.name, e.email,
              e.phone, e.message, e.created_at
       FROM enquiries e
       LEFT JOIN products p ON p.id = e.product_id
       ORDER BY e.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
