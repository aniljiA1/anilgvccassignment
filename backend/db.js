const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path for SQLite file
const dbFile = process.env.NODE_ENV === "production"
  ? "/mnt/data/data.db"      // Render
  : path.join(__dirname, "data.db");  // Local dev

// Create DB instance
const db = new sqlite3.Database(dbFile);

// --- Helpers ---
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, function (err, row) {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, function (err, rows) {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// --- Create tables ---
async function initTables() {
  try {
    await run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      short_desc TEXT,
      price REAL NOT NULL,
      image_url TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )`);

    await run(`CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )`);

   // console.log('✅ Tables created!');
  } catch (err) {
    console.error('Failed to create tables:', err);
  }
}

// --- Seed sample enquiries ---
async function seedEnquiries() {
  try {
    // Make sure table exists first
    await initTables();

    const row = await get('SELECT COUNT(*) as count FROM enquiries');
    if (row.count === 0) {
      const enquiries = [
        [1, 'John Doe', 'john@example.com', '1234567890', 'I am interested in this product.'],
        [2, 'Anil Kumar', 'eeeanilkumar1995@gmail.com', '8750427198', 'Please provide more details.'],
        [3, 'Bob Lee', 'bob@example.com', '9876543210', 'Is this available in stock?'],
        [4, 'Alice Green', 'alice@example.com', '5551234567', 'Can you ship this?'],
        [5, 'Mark Brown', 'mark@example.com', '4444444444', 'Looking for bulk order.'],
        [6, 'Lucy White', 'lucy@example.com', '4445556666', 'Is there a warranty?']
      ];

      for (const e of enquiries) {
        await run(
          `INSERT INTO enquiries (product_id, name, email, phone, message, created_at)
           VALUES (?, ?, ?, ?, ?, datetime('now'))`,
          e
        );
      }
      console.log('✅ Seeded sample enquiries');
    }
  } catch (err) {
    console.error('Failed to seed enquiries:', err);
  }
}

// Initialize tables and seed
initTables().then(seedEnquiries);

// Export
module.exports = {
  run,
  get,
  all,
  db
};
