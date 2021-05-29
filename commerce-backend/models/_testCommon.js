const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");
//let sandbox;

async function commonBeforeAll() {
    await db.query("DELETE FROM users");

    await db.query(` 
    INSERT INTO users (username, password, first_name, last_name, email, is_admin)
    VALUES ('testuser', '$2y$12$sSi55eDOdXTYxl30cWHSBOyF5YRUAl06A4xxaYKinL1D4RG7vnBk2',
	'Test', 'User', 'joes@gmail.com', FALSE),
	('testadmin', '$2y$12$sSi55eDOdXTYxl30cWHSBOyF5YRUAl06A4xxaYKinL1D4RG7vnBk2', 
	'Test', 'Admin!', 'joes@gmail.com', TRUE)`);

    const user_id_1 = await db.query(` 
    SELECT user_id
    FROM users
    WHERE username = 'testuser'
    `)

    const user_id_admin = await db.query(` 
    SELECT user_id
    FROM users
    WHERE username = 'testadmin'
    `)

    const shopping_cart_id_user_id_1 = await db.query(` 
    INSERT INTO shopping_cart (user_id)
    VALUES (${ user_id_1 })
    RETURNING shopping_cart_id 
    `);

    await db.query(` 
    INSERT INTO shopping_cart (user_id, is_closed)
    VALUES (${ user_id_1 }, TRUE)
    RETURNING shopping_cart_id 
    `);

    const shopping_cart_id_user_id_admin = await db.query(` 
    INSERT INTO shopping_cart (user_id)
    VALUES (${ user_id_admin })
    RETURNING shopping_cart_id 
    `);

    await db.query(` 
    INSERT INTO item (item_id, store_name, shopping_cart_id)
    VALUES (1, 'Amazon', ${shopping_cart_id_user_id_1}),
    (2, 'Amazon', ${shopping_cart_id_user_id_1}),
    (3, 'Ebay', ${shopping_cart_id_user_id_1}),
    (1, 'Amazon', ${shopping_cart_id_user_id_admin}),
    (2, 'Amazon', ${shopping_cart_id_user_id_admin}),
    (3, 'Ebay', ${shopping_cart_id_user_id_admin})
    `)

}

async function commonBeforeEach() {
    await db.query("BEGIN");
  }
  
  async function commonAfterEach() {
    await db.query("ROLLBACK");
  }
  
  async function commonAfterAll() {
    await db.end();
  }
  
  
  module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
  };