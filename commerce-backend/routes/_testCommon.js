//Source: Springboard
//parts leveraged from Springboard projects

"use strict";

const db = require("../db.js");
const User = require("../models/users");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
    //await db.query("BEGIN"); 
    await db.query("DELETE FROM users");

    await db.query(`ALTER SEQUENCE users_user_id_seq RESTART WITH 1`);

    const user = {username: "testuser", password: "password", 
                  firstName: "Test", lastName: "User", email: "joes@gmail.com", 
                  isAdmin: false}

    await User.register(user);

    // let testUser_id = await db.query(` 
    // SELECT user_id
    // FROM users
    // WHERE username = ${testuser}`);

    //console.log("test user id rows", testUser_id);

    // let adminUser_id = await db.query(` 
    // SELECT user_id
    // FROM users
    // WHERE username = ${testadmin}`);

    // let shopping_cart_id_testUser_id = await db.query(` 
    // INSERT INTO shopping_cart (is_closed, user_id)
    // VALUES (FALSE, 1)
    // RETURNING shopping_cart_id 
    // `);

    // let shopping_cart_id_adminUser_id = await db.query(` 
    // INSERT INTO shopping_cart (is_closed, user_id)
    // VALUES (FALSE, 2)
    // RETURNING shopping_cart_id 
    // `);

    // //adding a closed shopping cart for test user
    // const test_user_closed_cart = await db.query(` 
    // INSERT INTO shopping_cart (user_id, is_closed)
    // VALUES (1, TRUE)
    // RETURNING shopping_cart_id 
    // `);

    // //adding directly into test db items for both test user and admin user
    // await db.query(` 
    // INSERT INTO item (item_id, store_name, shopping_cart_id)
    // VALUES (1, 'Amazon', ${shopping_cart_id_testUser_id}),
    // (2, 'Amazon', ${shopping_cart_id_testUser_id}),
    // (3, 'Ebay', ${shopping_cart_id_testUser_id}),
    // (1, 'Amazon', ${shopping_cart_id_adminUser_id}),
    // (2, 'Amazon', ${shopping_cart_id_adminUser_id}),
    // (3, 'Ebay', ${shopping_cart_id_adminUser_id})
    // `);
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

//creating tokens for both test user and admin user
const u1Token = createToken({ username: "testuser", isAdmin: false });
const adminToken = createToken({ username: "testadmin", isAdmin: true });

  module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    adminToken,
  };