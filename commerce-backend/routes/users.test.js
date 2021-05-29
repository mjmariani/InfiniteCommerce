//Source: most tests below were leveraged from Springboard's typical tests for routes
//I ensured my routes passed these typical cases at the very least

"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/users");
//const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
  u1Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /users */
describe("POST /users", function () {
    test("works for admins: create non-admin", async function () {
      const resp = await request(app)
          .post("/users")
          .send({
            username: "u-new",
            firstName: "First-new",
            lastName: "Last-newL",
            password: "password-new",
            email: "new@email.com",
            isAdmin: false,
          })
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toEqual(expect.objectContaining({
        user: {
          username: "u-new",
          firstName: "First-new",
          lastName: "Last-newL",
          email: "new@email.com",
          isAdmin: false,
          shopping_cart_id: 4
        }, token: expect.any(String),
      }));
    });

    test("works for admins: create admin", async function () {
        const resp = await request(app)
            .post("/users")
            .send({
              username: "u-new",
              firstName: "First-new",
              lastName: "Last-newL",
              password: "password-new",
              email: "new@email.com",
              isAdmin: true,
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual(expect.objectContaining({
          user: {
            username: "u-new",
            firstName: "First-new",
            lastName: "Last-newL",
            email: "new@email.com",
            isAdmin: true,
            shopping_cart_id: 4
          }, token: expect.any(String),
        }));
      });

      test("unauth for users", async function () {
        const resp = await request(app)
            .post("/users")
            .send({
              username: "u-new",
              firstName: "First-new",
              lastName: "Last-newL",
              password: "password-new",
              email: "new@email.com",
              isAdmin: true,
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401);
      });
    
      test("unauth for a user w/o token", async function () {
        const resp = await request(app)
            .post("/users")
            .send({
              username: "u-new",
              firstName: "First-new",
              lastName: "Last-newL",
              password: "password-new",
              email: "new@email.com",
              isAdmin: true,
            });
        expect(resp.statusCode).toEqual(401);
      });

      test("bad request if missing data", async function () {
        const resp = await request(app)
            .post("/users")
            .send({
              username: "u-new",
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(400);
      });
    
      test("bad request if invalid data", async function () {
        const resp = await request(app)
            .post("/users")
            .send({
              username: "u-new",
              firstName: "First-new",
              lastName: "Last-newL",
              password: "password-new",
              email: "not-an-email",
              isAdmin: true,
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(400);
      });
});

/************************************** GET /users */

describe("GET /users", function () {
    test("works for admins", async function () {
      const resp = await request(app)
          .get("/users")
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.body).toEqual(expect.objectContaining({
        users: [
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
        ],
      }));
    });

    //non-admin users should not be able to pull list of all users
    test("unauth for non-admin users", async function () {
        const resp = await request(app)
            .get("/users")
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401);
      });

      test("unauth for user w/o token", async function () {
        const resp = await request(app)
            .get("/users");
        expect(resp.statusCode).toEqual(401);
      });

      //if no users exist, then error handler should be called 
      test("fails: test next() handler", async function () {
        // there's no normal failure event which will cause this route to fail ---
        // thus making it hard to test that the error-handler works with it. This
        // should cause an error
        await db.query("DROP TABLE users CASCADE");
        const resp = await request(app)
            .get("/users")
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(500);
      });
});

/************************************** GET /users/:username */
describe("GET /users/:username", function () {
    test("works for admin", async function () {
      const resp = await request(app)
          .get(`/users/testuser`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.body).toEqual(expect.objectContaining({
        user: {
            username: "testuser",
            firstName: "Test",
            lastName: "User",
            email: "joes@gmail.com",
            isAdmin: false,
            shopping_cart_id: 1
        },
      }));
    });

    test("works for same user", async function () {
        const resp = await request(app)
            .get(`/users/testuser`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual(expect.objectContaining({
          user: {
            username: "testuser",
            firstName: "Test",
            lastName: "User",
            email: "joes@gmail.com",
            isAdmin: false,
            shopping_cart_id: 1
          },
        }));
      });

      test("unauth for other users", async function () {
        const resp = await request(app)
            .get(`/users/testadmin`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401);
      });

      test("unauth for user w/o token", async function () {
        const resp = await request(app)
            .get(`/users/testuser`);
        expect(resp.statusCode).toEqual(401);
      });

      test("not found if user not found", async function () {
        const resp = await request(app)
            .get(`/users/nope`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
      });
});  

/************************************** PATCH /users/:username */

describe("PATCH /users/:username", () => {
    test("works for admins", async function () {
      const resp = await request(app)
          .patch(`/users/testuser`)
          .send({
            firstName: "New",
          })
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.body).toEqual(expect.objectContaining({
        user: {
            username: "testuser",
            firstName: "New",
            lastName: "User",
            email: "joes@gmail.com",
            isAdmin: false,
        },
      }));
    });

    test("works for same user", async function () {
        const resp = await request(app)
            .patch(`/users/testuser`)
            .send({
              firstName: "New",
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual(expect.objectContaining({
          user: {
            username: "testuser",
            firstName: "New",
            lastName: "User",
            email: "joes@gmail.com",
            isAdmin: false,
          },
        }));
      });

      test("unauth if not same user", async function () {
        const resp = await request(app)
            .patch(`/users/testadmin`)
            .send({
              firstName: "New",
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401);
      });

      test("unauth for user w/o token", async function () {
        const resp = await request(app)
            .patch(`/users/testuser`)
            .send({
              firstName: "New",
            });
        expect(resp.statusCode).toEqual(401);
      });

      test("not found if no such user", async function () {
        const resp = await request(app)
            .patch(`/users/nope`)
            .send({
              firstName: "Nope",
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
      });

      test("bad request if invalid data", async function () {
        const resp = await request(app)
            .patch(`/users/testuser`)
            .send({
              firstName: 42,
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(400);
      });

      test("bad request if invalid data w/ same user", async function () {
        const resp = await request(app)
            .patch(`/users/testuser`)
            .send({
              firstName: 42,
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
      });

      test("works: can set new password", async function () {
        const resp = await request(app)
            .patch(`/users/testuser`)
            .send({
              password: "new-password",
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.body).toEqual(expect.objectContaining({
          user: {
            username: "testuser",
            firstName: "New",
            lastName: "User",
            email: "joes@gmail.com",
            isAdmin: false,
          },
        }));
        const isSuccessful = await User.authenticate("testuser", "new-password");
        expect(isSuccessful).toBeTruthy();
      });

});

/************************************** DELETE /users/:username */

describe("DELETE /users/:username", function () {
    test("works for admin", async function () {
      const resp = await request(app)
          .delete(`/users/testuser`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.body).toEqual({ deleted: "testuser" });
    });

    test("works for same user", async function () {
        const resp = await request(app)
            .delete(`/users/testuser`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({ deleted: "testuser" });
      });

      test("unauth if not same user", async function () {
        const resp = await request(app)
            .delete(`/users/testadmin`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401);
      });

      test("unauth if not same user", async function () {
        const resp = await request(app)
            .delete(`/users/testadmin`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401);
      });

      test("unauth for a user w/o token", async function () {
        const resp = await request(app)
            .delete(`/users/testuser`);
        expect(resp.statusCode).toEqual(401);
      });

      test("not found if user missing", async function () {
        const resp = await request(app)
            .delete(`/users/nope`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
      });
});

/************************************** GET /[username]/[user_id]/shoppingcart */
describe("GET /:username/:user_id/shoppingcart", function () {
    test("works for admin", async function () {
      const resp = await request(app)
          .get(`/users/testuser/1/shoppingcart`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.body).toEqual(expect.objectContaining({ 
        shopping_cart_id: 1,
        items: [
            {
                item_id: 1,
                store_name: 'Amazon',
                shopping_cart_id: 1
            },
            {
                item_id: 2,
                store_name: 'Amazon',
                shopping_cart_id: 1
            },
            {
                item_id: 3,
                store_name: 'Ebay',
                shopping_cart_id: 1
            },
        ]

       }));
    });

    test("works for same user", async function () {
        const resp = await request(app)
            .get(`/users/testuser/1/shoppingcart`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual(expect.objectContaining({ 
          shopping_cart_id: 1,
          items: [
              {
                  item_id: 1,
                  store_name: 'Amazon',
                  shopping_cart_id: 1
              },
              {
                  item_id: 2,
                  store_name: 'Amazon',
                  shopping_cart_id: 1
              },
              {
                  item_id: 3,
                  store_name: 'Ebay',
                  shopping_cart_id: 1
              },
          ]
  
         }));
      });

      test("unauth for others", async function () {
        const resp = await request(app)
            .get(`/users/testadmin/2/shoppingcart`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual(401);});

        test("unauth for user w/o token", async function () {
            const resp = await request(app)
                .get(`/users/testadmin/2/shoppingcart`);
            expect(resp.body).toEqual(401);});

            test("not found for no such username", async function () {
                const resp = await request(app)
                    .get(`/users/nope/2/shoppingcart`)
                    .set("authorization", `Bearer ${adminToken}`);
                expect(resp.body).toEqual(404);});
});


/************************************** POST /[username]/[user_id]/shoppingcart/[store_name]/[item_id] */
describe("POST /:username/:user_id/shoppingcart/:store_name/:item_id", function () {
    test("works for admin", async function () {
      const resp = await request(app)
          .post(`/users/testuser/1/shoppingcart/Amazon/56`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.body).toEqual(expect.objectContaining({ 
        shopping_cart_id: 1,
        items: [
            {
                item_id: 1,
                store_name: 'Amazon',
                shopping_cart_id: 1
            },
            {
                item_id: 2,
                store_name: 'Amazon',
                shopping_cart_id: 1
            },
            {
                item_id: 3,
                store_name: 'Ebay',
                shopping_cart_id: 1
            },
            {
                item_id: 56,
                store_name: 'Amazon',
                shopping_cart_id: 1
            },
        ]

       }));
    });

    test("works for same user", async function () {
        const resp = await request(app)
            .post(`/users/testuser/1/shoppingcart/Amazon/56`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual(expect.objectContaining({ 
          shopping_cart_id: 1,
          items: [
              {
                  item_id: 1,
                  store_name: 'Amazon',
                  shopping_cart_id: 1
              },
              {
                  item_id: 2,
                  store_name: 'Amazon',
                  shopping_cart_id: 1
              },
              {
                  item_id: 3,
                  store_name: 'Ebay',
                  shopping_cart_id: 1
              },
              {
                  item_id: 56,
                  store_name: 'Amazon',
                  shopping_cart_id: 1
              },
          ]
  
         }));
      });

      test("unauth for others", async function () {
        const resp = await request(app)
            .post(`/users/testadmin/2/shoppingcart/Amazon/56`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual(401);});

        test("unauth for users w/o token", async function () {
            const resp = await request(app)
                .post(`/users/testadmin/2/shoppingcart/Amazon/56`)
            expect(resp.body).toEqual(401);});

        test("bad request for invalid shopping cart", async function () {
            const resp = await request(app)
                .post(`/users/testuser/90/shoppingcart/Amazon/56`)
                .set("authorization", `Bearer ${u1Token}`);
            expect(resp.body).toEqual(400);});

        test("bad request for closed shopping cart", async function () {
            const resp = await request(app)
                .post(`/users/testuser/90/shoppingcart/Amazon/56`)
                .set("authorization", `Bearer ${u1Token}`);
            expect(resp.body).toEqual(400);});

});


/************************************** DELETE /[username]/[user_id]/shoppingcart/[store_name]/[item_id] */
describe("DELETE /:username/:user_id/shoppingcart/:store_name/:item_id", function () {
    test("works for admin", async function () {
        const resp = await request(app)
          .post(`/users/testuser/1/shoppingcart/Amazon/1`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.body).toEqual(expect.objectContaining({ 
        shopping_cart_id: 1,
        items: [
            {
                item_id: 2,
                store_name: 'Amazon',
                shopping_cart_id: 1
            },
            {
                item_id: 3,
                store_name: 'Ebay',
                shopping_cart_id: 1
            },
        ]

       }));
    });

    test("works for same user", async function () {
        const resp = await request(app)
          .post(`/users/testuser/1/shoppingcart/Amazon/1`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual(expect.objectContaining({ 
        shopping_cart_id: 1,
        items: [
            {
                item_id: 2,
                store_name: 'Amazon',
                shopping_cart_id: 1
            },
            {
                item_id: 3,
                store_name: 'Ebay',
                shopping_cart_id: 1
            },
        ]

       }));
    });

    test("does not work for other user", async function () {
        const resp = await request(app)
          .post(`/users/testadmin/1/shoppingcart/Amazon/1`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual(401);
    });

    test("does not work for other item not existing", async function () {
        const resp = await request(app)
          .post(`/users/testuser/1/shoppingcart/Amazon/100`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual(400);
    });

});



/************************************** POST /[username]/[user_id]/shoppingcart */
describe("POST /:username/:user_id/shoppingcart", function () {
    test("works for admin", async function () {
        const resp = await request(app)
          .post(`/users/testuser/1/shoppingcart`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.body).toEqual(expect.objectContaining({ 
        shopping_cart_id: 4,
        items: [{

        }
        ]

       }));
    });

    test("works for same user", async function () {
        const resp = await request(app)
          .post(`/users/testuser/1/shoppingcart`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual(expect.objectContaining({ 
        shopping_cart_id: 4,
        items: [
            {

            }
        ]

       }));
    });

    test("unauth for other user", async function () {
        const resp = await request(app)
          .post(`/users/testadmin/1/shoppingcart`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual(401);
    });

    test("does not work for other shopping cart not existing (bad request)", async function () {
        const resp = await request(app)
          .post(`/users/testuser/100/shoppingcart`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual(400);
    });
});