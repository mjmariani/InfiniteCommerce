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

