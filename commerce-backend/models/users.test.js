"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** authenticate */

describe("authenticate", function (){
  test("works for regular user", async function (){
    const user = await User.authenticate("testuser", "password");
    expect(user).toEqual({ 
      username: "testuser",
      first_name: "Test",
      last_name: "User",
      email: "joes@gmail.com",
      isAdmin: false
    })
  });

  test("works", async function (){
    const user = await User.authenticate("testadmin", "password");
    expect(user).toEqual({ 
      username: "testadmin",
      first_name: "Test",
      last_name: "Admin!",
      email: "joes@gmail.com",
      isAdmin: true
    })
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("nope", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
})

/************************************** register */

describe("register", function () {
  const newUser = {
    username: "new",
    firstName: "Test",
    lastName: "Tester",
    email: "test@test.com",
    isAdmin: false,
  };

  test("works", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
    });
    expect(user).toEqual(newUser);
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(false);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("works: adds admin", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
      isAdmin: true,
    });
    expect(user).toEqual({ ...newUser, isAdmin: true });
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(true);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with dup data", async function () {
    try {
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works", async function () {
    const users = await User.findAll();
    expect(users).toEqual([
      {
        username: "testuser",
        firstName: "Test",
        lastName: "User",
        email: "joes@gmail.com",
        isAdmin: false,
      },
      {
        username: "testadmin",
        firstName: "Test",
        lastName: "Admin!",
        email: "joes@gmail.com",
        isAdmin: true,
      },
    ]);
  });
});




/************************************** get */
describe("get", function () {
  test("works", async function () {
    let user = await User.get("testuser");
    expect(user).toEqual({
      username: "testuser",
      firstName: "Test",
      lastName: "User",
      email: "joes@gmail.com",
      isAdmin: false
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */
describe("update", function () {
  const updateData = {
    firstName: "NewF",
    lastName: "NewF",
    email: "new@email.com"
  };

  test("works", async function () {
    let updatedata = await User.update("testuser", updateData);
    expect(updatedata).toEqual({
      username: "testuser",
      ...updateData,
    });
  });

  test("works: set password", async function () {
    let updatedata = await User.update("testuser", {
      password: "new",
    });
    expect(updatedata).toEqual({
      username: "testuser",
      firstName: "Test",
      lastName: "User",
      email: "joes@gmail.com",
      isAdmin: false,
    });
    const found = await db.query("SELECT * FROM users WHERE username = 'testuser'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("not found if no such user", async function () {
    try {
      await User.update("nope", {
        firstName: "test",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if no data", async function () {
    expect.assertions(1);
    try {
      await User.update("testuser", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

});


/************************************** remove */
describe("remove", function () {
  test("works", async function () {
    await User.remove("testuser");
    const res = await db.query(
        "SELECT * FROM users WHERE username='testuser'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
      await User.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** findShoppingCartByUserId */

describe("find shopping cart by user id", function (){
  test("works", async function (){
    const shopping_cart_id = await User.findShoppingCartByUserId(1);
    expect(shopping_cart_id).toEqual(1);
  });
  test("not found if no such user id exists", async function (){
    try{
      const shopping_cart_id = await User.findShoppingCartByUserId(11);
    }catch(err){
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
})

/************************************** findShoppingCartByUsername */
describe("find shopping cart by username", function (){
  test("works", async function (){
    const shopping_cart_id = await User.findShoppingCartByUsername('testuser');
    expect(shopping_cart_id).toEqual(1);
  });
  test("not found if no such username exists", async function (){
    try{
      const shopping_cart_id = await User.findShoppingCartByUsername('nope');
    }catch(err){
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
})

/************************************** closeShoppingCartByCartId */
describe("close shopping cart by user id", function (){ 
  test("works", async function (){
    const new_shopping_cart_id = await User.closeShoppingCartByCartId(1);
    expect(new_shopping_cart).toEqual(3);
  })

  test("result should be falsy if user_id does not exist", async function (){
    const new_shopping_cart_id = await User.closeShoppingCartByCartId(50);
    expect(new_shopping_cart).toBeFalsy();
  })
})


/************************************** add item (add item to shopping cart) */
describe("add item", function (){ 
  test("works", async function (){
    const item_id = await User.addItem(1,403,'Amazon');
    expect(item_id).toEqual(403);
  });

  test("it's falsy if shopping cart id does not exist", async function (){
    const item_id = await User.addItem(90,403,'Amazon');
    expect(item_id).toBeFalsy();
  });

  test("increasing quantity works", async function (){
    const item_id = await User.updateQuantityOfItem(90,403,'Amazon', 2);
    expect(item_id).toEqual({ item_id: 403, quantity: 2 });
  });

  test("decreasing quantity works", async function (){
    const item_id = await User.updateQuantityOfItem(90,403,'Amazon', 1);
    expect(item_id).toEqual({ item_id: 403, quantity: 1 });
  });
})


/************************************** delete item (delete item to shopping cart) */
describe("delete an item", function (){
  test("works", async function (){ 
    const success = await User.deleteItem(1, 1, 'Amazon');
    expect(success).toEqual("successful")
  });

  test("does not work if item does not exist", function (){
    const success = await User.deleteItem(1, 76, 'Amazon');
    expect(success).toEqual("not successful")
  });

  test("does not work if shopping cart does not exist", function (){
    const success = await User.deleteItem(76, 1, 'Amazon');
    expect(success).toEqual("not successful")
  });

  test("does not work if store name does not exist", function (){
    const success = await User.deleteItem(1, 1, 'Nike');
    expect(success).toEqual("not successful")
  });

});


/************************************** getAllItemsForCurrentCart */
describe("get all items for current cart", function (){
  test("works for user id 1", async function (){ 
    const items = await User.getAllItemsForCurrentCart(1,1);
    expect(items).toBeTruthy();
    expect(items).toEqual([{ item_id: 1, store_name: 'Amazon', shopping_cart_id: 1 }, 
    {item_id: 2, store_name: 'Amazon', shopping_cart_id: 1 }, 
    { item_id: 3, store_name: 'Ebay', shopping_cart_id: 1}])
  });

  test("works for user id 2", async function (){ 
    const items = await User.getAllItemsForCurrentCart(2,3);
    expect(items).toBeTruthy();
    expect(items).toEqual([{ item_id: 1, store_name: 'Amazon', shopping_cart_id: 3 }, 
    {item_id: 2, store_name: 'Amazon', shopping_cart_id: 3 }, 
    { item_id: 3, store_name: 'Ebay', shopping_cart_id: 3}])
  });

  test("does not work if shopping cart belongs to another user id", function (){
    const items = await User.getAllItemsForCurrentCart(2,1);
    expect(items).toBeFalsy();
  });

  test("does not work if shopping cart belongs to another user id (reversing user id and shopping cart id)", function (){
    const items = await User.getAllItemsForCurrentCart(1,3);
    expect(items).toBeFalsy();
  });

  test("does not work if user id does not exist", function (){
    const items = await User.getAllItemsForCurrentCart(90,2);
    expect(items).toBeFalsy();
  })

  test("does not work if shopping cart does not exist", function (){
    const items = await User.getAllItemsForCurrentCart(1,92);
    expect(items).toBeFalsy();
  })

  test("does not work if shopping cart is closed", function (){
    const items = await User.getAllItemsForCurrentCart(1,2);
    expect(items).toBeFalsy();
  })

});
