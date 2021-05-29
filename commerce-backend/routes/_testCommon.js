//Source: Springboard
//parts leveraged from Springboard projects

"use strict";

const db = require("../db.js");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
    await db.query("DELETE FROM users");

    const testUser = await User.register({
        username: "testuser",
        password: "password",
        firstName: "Test",
        lastName: "User",
        email: "joes@gmail.com",
        isAdmin: false,
    });

    const adminUser = await User.register({
        username: "testadmin",
        password: "password",
        firstName: "Test",
        lastName: "Admin!",
        email: "joes@gmail.com",
        isAdmin: true,
    });

    //adding a closed shopping cart for test user
    await db.query(` 
    INSERT INTO shopping_cart (user_id, is_closed)
    VALUES (${ testUser.shopping_cart_id }, TRUE)
    RETURNING shopping_cart_id 
    `);

    //adding directly into test db items for both test user and admin user
    await db.query(` 
    INSERT INTO item (item_id, store_name, shopping_cart_id)
    VALUES (1, 'Amazon', ${testUser.shopping_cart_id}),
    (2, 'Amazon', ${testUser.shopping_cart_id}),
    (3, 'Ebay', ${testUser.shopping_cart_id}),
    (1, 'Amazon', ${adminUser.shopping_cart_id}),
    (2, 'Amazon', ${adminUser.shopping_cart_id}),
    (3, 'Ebay', ${adminUser.shopping_cart_id})
    `);

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