"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./users.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("./_testCommon");
//const { any } = require("sequelize/types/lib/operators");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** authenticate */

describe("authenticate", function (){
  test("works for regular user", async function (){
    const user = await User.authenticate("testuser", "password");
    expect(user).toMatchObject({ 
      username: "testuser",
      first_name: "Test",
      last_name: "User",
      email: "joes@gmail.com",
      is_admin: false,
    })
  });

  test("works", async function (){
    const user = await User.authenticate("testadmin", "password");
    expect(user).toMatchObject({ 
      username: "testadmin",
      first_name: "Test",
      last_name: "Admin!",
      email: "joes@gmail.com",
      is_admin: true,
    })
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("nope", "password");
      //fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
})

/************************************** register */

describe("register", function () {
  const newUser = {
    username: "new1",
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
    expect(user).toMatchObject({"email":"test@test.com","username":"new1"});
    const found = await db.query("SELECT * FROM users WHERE username = 'new1'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(false);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  const newAdminUser = {
    username: "new1Admin",
    firstName: "Test",
    lastName: "Tester",
    email: "test@test.com",
    isAdmin: true,
  };

  test("works: adds admin", async function () {
    let user = await User.register({
      ...newAdminUser,
      password: "password",
      isAdmin: true,
    });
    expect(user).toMatchObject({ ...newUser, isAdmin: true });
    const found = await db.query("SELECT * FROM users WHERE username = 'new1Admin'");
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
      //fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works", async function () {
    const users = await User.findAll();
    expect(users).toEqual(objectContaining([
      {
        username: "testadmin",
        firstName: "Test",
        lastName: "Admin!",
        email: "joes@gmail.com",
        isAdmin: true,
      },
      {
        username: "new1",
        "firstName": "Test",
        "isAdmin": false,
        "lastName": "Tester",
        "email": "test@test.com"
      },
    ]));
  });
});


/************************************** get */
describe("get", function () {
  test("works", async function () {
    let user = await User.get("testuser");
    expect(users).toEqual(objectContaining({
      username: "testuser",
      firstName: "Test",
      lastName: "User",
      email: "joes@gmail.com",
      isAdmin: false,
    }));
  });

  test("not found if no such user", async function () {
    try {
      const user = await User.get("nope");
      //fail();
      expect(user).toBeFalsy();
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundError);
    }
  });
});

/************************************** update */
describe("update", function () {
  const updateData = {
    first_name: "NewF",
    last_name: "NewF",
    email: "new@email.com"
  };

  test("works", async function () {
    const updatedata = await User.update("testuser", updateData);
    expect(updatedata).toEqual(objectContaining({
      username: "testuser",
      ...updateData,
    }));
  });

  test("works: set password", async function () {
    const updatedata = await User.update("testuser", {
      password: "new",
    });
    expect(updatedata).toMatchObject({
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
    
      await expect(User.update("nope", {
        first_name: "test",
      })).toBeFalsy();
  });

  test("bad request if no data", async function () {
    expect.assertions(1);
    try {
      await User.update("testuser", {});
      //fail();
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundError);
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
      //fail();
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundError);
    }
  });
});

/************************************** findShoppingCartByUserId */

describe("find shopping cart by user id", function (){
  test("works", async function (){
    const user_id = parseInt(await User.get("testuser").user_id);
    const shopping_cart_id = parseInt(await User.findShoppingCartByUserId(user_id));
    expect(shopping_cart_id).toBeTruthy();
  });
  test("not found if no such user id exists", async function (){
    try{
      const shopping_cart_id = await User.findShoppingCartByUserId(11);
    }catch(err){
    expect(err).toBeInstanceOf(NotFoundError);
  }
  });
})

/************************************** findShoppingCartByUsername */
describe("find shopping cart by username", function (){
  test("works", async function (){
    const user_id = parseInt(await User.get("testuser").user_id);
    const shopping_cart_id = parseInt(await User.findShoppingCartByUsername(user_id));
    expect(shopping_cart_id).toBeTruthy();
  });
  test("not found if no such username exists", async function (){
    try{
      const shopping_cart_id = await User.findShoppingCartByUsername('nope');
    }catch(err){
      expect(err).toBeInstanceOf(NotFoundError);
    }    
  });
})

/************************************** closeShoppingCartByCartId */
describe("close shopping cart by user id", function (){ 
  test("works", async function (){
    const user_id = parseInt(await User.get("testuser").user_id);
    const shopping_cart_id = parseInt(await User.findShoppingCartByUsername(user_id));
    const new_shopping_cart_id = await User.closeShoppingCartByCartId(shopping_cart_id);
    expect(new_shopping_cart).toBeTruthy();
  })

  test("result should be falsy if user_id does not exist", async function (){
    const new_shopping_cart_id = await User.closeShoppingCartByCartId(50);
    expect(new_shopping_cart).toBeFalsy();
  })
})


/************************************** add item (add item to shopping cart) */
describe("add item", function (){ 
  test("works", async function (){
    const user_id = parseInt(await User.get("testuser").user_id);
    const shopping_cart_id = parseInt(await User.findShoppingCartByUsername(user_id));
    const item_id = await User.addItem(shopping_cart_id,'Amazon',403);
    expect(item_id).toBeTruthy();
  });

  test("it's falsy if shopping cart id does not exist", async function (){
    const user_id = parseInt(await User.get("testuser").user_id);
    const shopping_cart_id = parseInt(await User.findShoppingCartByUsername(user_id));
    const item_id = await User.addItem(shopping_cart_id,'Amazon',403);
    expect(item_id).toBeFalsy();
  });

  test("increasing quantity works", async function (){
    const user_id = parseInt(await User.get("testuser").user_id);
    const shopping_cart_id = parseInt(await User.findShoppingCartByUsername(user_id));
    const item_id = await User.updateQuantityOfItem(shopping_cart_id,403,'Amazon', 2);
    expect(item_id).toEqual(expect.objectContaining({ quantity: 2 }));
  });

  test("decreasing quantity works", async function (){
    const user_id = parseInt(await User.get("testuser").user_id);
    const shopping_cart_id = parseInt(await User.findShoppingCartByUsername(user_id));
    const item_id = await User.updateQuantityOfItem(shopping_cart_id,403,'Amazon', 1);
    expect(item_id).toEqual(expect.objectContaining({ quantity: 1 }));
  });
})


/************************************** delete item (delete item to shopping cart) */
describe("delete an item", function (){
  test("works", async function (){
    const user_id = parseInt(await User.get("testuser").user_id);
    const shopping_cart_id = parseInt(await User.findShoppingCartByUsername(user_id)); 
    const item_id = await User.addItem(shopping_cart_id,'Amazon',403);
    const success = await User.deleteItem(shopping_cart_id, 403, 'Amazon');
    expect(success).toEqual("successful")
  });

  test("does not work if item does not exist", async function (){
    const user_id = parseInt(await User.get("testuser").user_id);
    const shopping_cart_id = parseInt(await User.findShoppingCartByUsername(user_id)); 
    const success = await User.deleteItem(shopping_cart_id, 403, 'Amazon');
    expect(success).toEqual("not successful")
  });

  test("does not work if shopping cart does not exist", async function (){
    const success = await User.deleteItem(76, 1, 'Amazon');
    expect(success).toEqual("not successful")
  });

  test("does not work if store name does not exist", async function (){
    const user_id = parseInt(await User.get("testuser").user_id);
    const shopping_cart_id = parseInt(await User.findShoppingCartByUsername(user_id));
    await User.addItem(shopping_cart_id,'Amazon',403); 
    const success = await User.deleteItem(shopping_cart_id, 403, 'Nike');
    expect(success).toEqual("not successful")
  });

});


/************************************** getAllItemsForCurrentCart */
describe("get all items for current cart", function (){
  test("works for user \"testuser\"", async function (){
    const user_id = parseInt(await User.get("testuser").user_id);
    const shopping_cart_id = parseInt(await User.findShoppingCartByUsername(user_id)); 
    const items = await User.getAllItemsForCurrentCart(user_id,shopping_cart_id);
    expect(items).toBeTruthy();
    expect(items).toEqual([{ item_id: 1, store_name: 'Amazon', shopping_cart_id: 1 }, 
    {item_id: 2, store_name: 'Amazon', shopping_cart_id: 1 }, 
    { item_id: 3, store_name: 'Ebay', shopping_cart_id: 1}])
  });

  test("works for user \"testadmin\"", async function (){ 
    const user_id = parseInt(await User.get("testadmin").user_id);
    const shopping_cart_id = parseInt(await User.findShoppingCartByUsername(user_id)); 
    const items = await User.getAllItemsForCurrentCart(user_id,shopping_cart_id);
    expect(items).toBeTruthy();
    expect(items).toEqual([{ item_id: 1, store_name: 'Amazon', shopping_cart_id: 3 }, 
    {item_id: 2, store_name: 'Amazon', shopping_cart_id: 3 }, 
    { item_id: 3, store_name: 'Ebay', shopping_cart_id: 3}])
  });

  test("does not work if shopping cart belongs to another user id", async function (){
    const items = await User.getAllItemsForCurrentCart(2,1);
    expect(items).toEqual([]);
  });

  test("does not work if shopping cart belongs to another user id (reversing user id and shopping cart id)", async function (){
    const items = await User.getAllItemsForCurrentCart(1,3);
    expect(items).toEqual([]);
  });

  test("does not work if user id does not exist", async function (){
    const items = await User.getAllItemsForCurrentCart(90,2);
    expect(items).toEqual([]);
  })

  test("does not work if shopping cart does not exist", async function (){
    const items = await User.getAllItemsForCurrentCart(1,92);
    expect(items).toEqual([]);
  })

  test("does not work if shopping cart is closed", async function (){
    const items = await User.getAllItemsForCurrentCart(1,2);
    expect(items).toEqual([]);
  })

});
