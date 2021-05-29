CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  joined_date DATE DEFAULT CURRENT_DATE,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE shopping_cart (
  user_id INTEGER REFERENCES users ON DELETE CASCADE, 
  shopping_cart_id SERIAL PRIMARY KEY,
  is_closed BOOLEAN NOT NULL DEFAULT FALSE 
);

CREATE TABLE item (
  item_id INTEGER PRIMARY KEY,
  quantity INTEGER DEFAULT 1,
  store_name TEXT,
  shopping_cart_id INTEGER NOT NULL
    REFERENCES shopping_cart ON DELETE CASCADE
);