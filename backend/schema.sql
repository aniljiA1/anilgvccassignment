-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT,
  short_desc TEXT,
  price REAL NOT NULL,
  image_url TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- SEED DATA
INSERT INTO products (name, category, short_desc, price, image_url)
VALUES
('LED TV 32 inch', 'electronics', 'HD ready smart TV', 15000, '/images/tv.jpg'),
('Running Shoes', 'fashion', 'Comfortable sports shoes', 2400, '/images/shoes.jpg'),
('Mixer Grinder', 'kitchen', '3 jar mixer grinder', 3200, '/images/mixer.jpg'),
('Bluetooth Headphones', 'electronics', 'Wireless headphones', 1800, '/images/headphones.jpg'),
('Water Bottle', 'sports', '1 litre BPA-free bottle', 250, '/images/bottle.jpg'),
('Office Chair', 'furniture', 'Ergonomic office chair', 6500, '/images/chair.jpg');

-- ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
