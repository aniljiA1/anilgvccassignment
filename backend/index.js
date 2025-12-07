require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const productsRouter = require('./routes/products');
const enquiriesRouter = require('./routes/enquiries');
const { run } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: [
    "http://localhost:3000",   // If React dev server
    "http://localhost:5000",   // For testing
    //"https://anilgvccbackend-1.onrender.com" // Render backend
    //"https://<your-frontend-domain>" // Add if frontend deployed on Render/Vercel
  ],
  credentials: true
}));

app.use(express.json());

// --- DB Initialization ---
async function initDB() {
  try {
    const sqlFile = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(sqlFile)) {
      const sql = fs.readFileSync(sqlFile, 'utf-8');
      const statements = sql.split(/;\s*\n/).filter(s => s.trim());

      for (const stmt of statements) {
        try {
          await run(stmt);
        } catch (err) {
          if (!/already exists/i.test(err.message)) console.error(err);
        }
      }
      console.log('✅ Database initialized!');
    } else {
      console.warn('⚠️ schema.sql not found, skipping DB initialization');
    }
  } catch (err) {
    console.error('❌ DB initialization failed:', err);
  }
}

initDB();

// --- API Routes ---
app.use('/api/products', productsRouter);
app.use('/api/enquiries', enquiriesRouter);

// --- Health check ---
app.get('/api/health', (req, res) => res.json({ ok: true }));

// --- Root ---
app.get('/', (req, res) => res.send('Backend is running!'));

// --- Serve Frontend ---
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  // Express 5 SAFE CATCH-ALL
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
