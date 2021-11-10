//node-postgres docs: https://node-postgres.com/api/result

const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");
//let sandbox;

async function commonBeforeAll() {
    //await db.query("BEGIN");
    await db.query("DELETE FROM users");

    await db.query(`ALTER SEQUENCE users_user_id_seq RESTART WITH 1`);

    await db.query(` 
    INSERT INTO users (username, password, first_name, last_name, email, is_admin)
    VALUES 
      ('testuser','$2a$04$93YxqGRIVPLaP0B2vO19Cebs/3kFQGm5Op7ihnVUSQKnB2GzhiHAa', 'Test', 'User', 'joes@gmail.com', FALSE),
	    ('testadmin','$2a$04$93YxqGRIVPLaP0B2vO19Cebs/3kFQGm5Op7ihnVUSQKnB2GzhiHAa','Test', 'Admin!', 'joes@gmail.com', TRUE)`
    );

    const testuser = 'testuser';
    const testadmin = 'testadmin';


    let user_id_1_result = await db.query(` 
    SELECT user_id
    FROM users
    WHERE username = 'testuser'`);

    let user_id_1 = user_id_1_result.rows[0].user_id;

    let user_id_admin_result = await db.query(` 
    SELECT user_id
    FROM users
    WHERE username = 'testadmin'`);

    let user_id_admin = user_id_admin_result.rows[0].user_id;

    let shopping_cart_id_user_id_1_result = await db.query(` 
    INSERT INTO shopping_cart (is_closed, user_id)
    VALUES (FALSE, $1)
    RETURNING shopping_cart_id 
    `, [user_id_1]);

    let shopping_cart_id_user_id_1 = shopping_cart_id_user_id_1_result.rows[0].shopping_cart_id;

    //adding closed shopping cart
    await db.query(` 
    INSERT INTO shopping_cart (user_id, is_closed)
    VALUES (${ user_id_1 }, TRUE)
    RETURNING shopping_cart_id 
    `);

    let shopping_cart_id_user_id_admin_result = await db.query(` 
    INSERT INTO shopping_cart (is_closed, user_id)
    VALUES (FALSE, $1)
    RETURNING shopping_cart_id 
    `, [user_id_admin]);

    let shopping_cart_id_user_id_admin = shopping_cart_id_user_id_admin_result.rows[0].shopping_cart_id;

    await db.query(` 
    INSERT INTO item (item_id, store_name, shopping_cart_id)
    VALUES (1, 'Amazon', ${shopping_cart_id_user_id_1}),
    (2, 'Amazon', ${shopping_cart_id_user_id_1}),
    (3, 'Ebay', ${shopping_cart_id_user_id_1}),
    (4, 'Amazon', ${shopping_cart_id_user_id_admin}),
    (5, 'Amazon', ${shopping_cart_id_user_id_admin}),
    (6, 'Ebay', ${shopping_cart_id_user_id_admin})
    `);
    //await db.query("COMMIT");
}

async function commonBeforeEach() {

    await db.query("BEGIN");
  }
  
  async function commonAfterEach() {
    await db.query("COMMIT");
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