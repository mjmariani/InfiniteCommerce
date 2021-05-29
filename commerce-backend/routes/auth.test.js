//Source: some parts were leveraged from Springboard's typical testing cases for auth tests

"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

//const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /auth/token */
describe("POST /auth/token", function () {
    test("works", async function () {
      const resp = await request(app)
          .post("/auth/token")
          .send({
            username: "testuser",
            password: "password",
          });
      expect(resp.body).toEqual({
        "token": expect.any(String),
      });
    });

    test("unauth with non-existent user", async function () {
        const resp = await request(app)
            .post("/auth/token")
            .send({
              username: "no-such-user",
              password: "password1",
            });
        expect(resp.statusCode).toEqual(401);
      });

      test("unauth with wrong password", async function () {
        const resp = await request(app)
            .post("/auth/token")
            .send({
              username: "testuser",
              password: "nope",
            });
        expect(resp.statusCode).toEqual(401);
      });

      test("bad request with missing data", async function () {
        const resp = await request(app)
            .post("/auth/token")
            .send({
              username: "testuser",
            });
        expect(resp.statusCode).toEqual(400);
      });

      test("bad request with invalid data", async function () {
        const resp = await request(app)
            .post("/auth/token")
            .send({
              username: 42,
              password: "above-is-a-number",
            });
        expect(resp.statusCode).toEqual(400);
      });
});

/************************************** POST /auth/register */
describe("POST /auth/register", function () {
    test("works for user w/o token", async function () {
      const resp = await request(app)
          .post("/auth/register")
          .send({
            username: "new",
            firstName: "first",
            lastName: "last",
            password: "password",
            email: "new@email.com",
            isAdmin: false,
          });
      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toEqual({
        "token": expect.any(String),
      });
    });

    test("bad request with missing fields", async function () {
        const resp = await request(app)
            .post("/auth/register")
            .send({
              username: "new",
            });
        expect(resp.statusCode).toEqual(400);
      });

      test("bad request with invalid data", async function () {
        const resp = await request(app)
            .post("/auth/register")
            .send({
              username: "new",
              firstName: "first",
              lastName: "last",
              password: "password",
              email: "not-an-email",
            });
        expect(resp.statusCode).toEqual(400);
      });

});