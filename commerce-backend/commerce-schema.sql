CREATE TABLE users (
  user_id INTEGER GENERATED ALWAYS AS IDENTITY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  joined_date DATE DEFAULT CURRENT_DATE,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY(user_id)
);

CREATE TABLE shopping_cart ( 
  shopping_cart_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  is_closed BOOLEAN NOT NULL DEFAULT FALSE,
  user_id INTEGER
);

CREATE TABLE item (
  item_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  asin TEXT,
  quantity INTEGER DEFAULT 1,
  store_name TEXT,
  shopping_cart_id INTEGER
);

ALTER TABLE shopping_cart ADD CONSTRAINT s_u_fk
  FOREIGN KEY (user_id) REFERENCES users ON DELETE CASCADE;

ALTER TABLE item ADD CONSTRAINT i_s_fk
  FOREIGN KEY (shopping_cart_id) REFERENCES shopping_cart ON DELETE CASCADE;

ALTER TABLE shopping_cart ALTER CONSTRAINT s_u_fk
  DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE item ALTER CONSTRAINT i_s_fk
  DEFERRABLE INITIALLY DEFERRED;