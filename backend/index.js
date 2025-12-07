require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const enquiriesRouter = require('./routes/enquiries');
const path = require('path');
const fs = require('fs');
const { run } = require('./db'); // your promisified DB helper

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- DB Initialization ---
async function initDB() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
  const statements = sql.split(/;\s*\n/).filter(s => s.trim());
  for (const stmt of statements) {
    try {
      await run(stmt);
    } catch (err) {
      // ignore table exists errors
      if (!/already exists/.test(err.message)) console.error(err);
    }
  }
  console.log('✅ Database initialized!');
}

initDB();

// --- API routes ---
app.use('/api/products', productsRouter);
app.use('/api/enquiries', enquiriesRouter);

// --- Health check ---
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.get('/', (req, res) => {
  res.send('Backend is running!');
});


// Optional: Serve frontend
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => res.sendFile(path.join(frontendDist, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
