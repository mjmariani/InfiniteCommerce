"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class Users{
/** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

static async authenticate(username, password){
    try{
       //try to find the user first
    const queryResult = await db.query( 
        `SELECT username, first_name, last_name, email, is_admin
        FROM users 
        WHERE username = $1`,[username],
    );
    const user = queryResult.rows[0];
    
    if(user){
        //compare hashed password (retrieved from query) to the hash from the password provided by user (@params password)
        const isValid = await bcrypt.compare(password, user.password);
        if(isValid === true){
            //remove the password attribute from the user obj before returning
            delete user.password;
            return user;
        }
    }

    }catch(error){
        throw new UnauthorizedError("Invalid username/password");
    }
}


/** Register user with data.
   * data is deconstructed from req.body
   * @params {username, firstName, lastName, email, isAdmin}
   * @returns { user_id, username, firstName, lastName, email, isAdmin, shopping_cart_id }
   *
   * Throws BadRequestError on duplicates.
**/

static async register( 
    {username, password, firstName, lastName, email, isAdmin}
){
    const checkDuplicateUsers = await db.query( 
        `SELECT username
        FROM users
        WHERE username = $1`,
        [username],
    );

    //throw bad request error with message that there are duplicate usernames
    if(checkDuplicateUsers.rows[0]){
        throw new BadRequestError(`Duplicate username: ${username}`);
    }
    
    //if no duplicate username, then proceed with hashing password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const userResult = await db.query( 
        `INSERT INTO users
        (username, password, first_name, last_name, email, is_admin)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING user_id, username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
        [
            username, hashedPassword, firstName, lastName, email, isAdmin,
        ],
    );

    const user = userResult.rows[0];

    const userShoppingCartResult = await db.query( 
        `INSERT INTO shopping_cart
        (user_id)
        VALUES ($1)
        RETURNING shopping_cart_id`,
        [user.user_id],
    );

    //add shopping cart id into users object
    user['shopping_cart_id'] = userShoppingCartResult.rows[0].shopping_cart_id;

    const shoppingCartCache = await db.query( 
        `UPDATE users
        SET shopping_card_id = ${user.shopping_cart_id}
        WHERE username = ${user.username}
        RETURNING username, shopping_cart_id`
    );
    
    return user;

}

/** Find all users.
   *
   * Returns [{ username, first_name, last_name, email, is_admin }, ...]
**/

static async findAll() {
    const result = await db.query( 
        `SELECT username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin" 
        FROM users
        ORDER BY username`,
    );
    return result.rows;
}


  /** Given a username, return data about user.
   *
   * Returns { username, first_name, last_name, is_admin, shopping_cart_id }
   *
   * Throws NotFoundError if user not found.
   **/

static async get(username){
    const userRes = await db.query( 
        `SELECT user_id, username, first_name AS "firstName, last_name AS "lastName", email, is_admin AS "isAdmin", shopping_cart_id AS "shoppingCartID"
        FROM users
        WHERE username = $1`,
        [username],
    );

    const user = userRes.rows[0];

    if(!user) throw new NotFoundError(`No user found by username: ${username}`);

    return user;
}



  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, isAdmin }
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   */
static async update(username, data){

    //if password is included in data from request then hash the password given and set data.password to the new hash
    if(data.password){
        data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const {setCols, values} = sqlForPartialUpdate( 
        data, 
        {firstName: "first_name",
        lastName: "last_name",
        password: "password",
        email: "email"}
    );

    //to get the username from the values obj returned from sqlForPartialUpdate
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users
                    SET ${setCols}
                    WHERE username = ${usernameVarIdx}
                    RETUNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                is_admin AS "isAdmin"`;
    
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if(!user) throw new NotFoundError(`No user found by username: ${username}`);

    delete user.password;
    return user;
}

// /** Add or update/overwrite a store_name to user's opened shopping cart
//  *  
//  * 
//  * @returns username, storeName and shoppingCartID
//  */

// static async updateStoreName(shoppingCartID, storeName){

//     const updateStoreName = await db.query( 
//         `UPDATE shopping_cart
//         SET store_name = $1
//         WHERE shopping_cart_id = $2
//         RETURNING username, shopping_cart_id, store_name`,
//         [storeName, shoppingCartID],
//     );

//     return updateStoreName.rows[0]
// }


/** Find a shopping cart for User
 * @params: userId
 * @returns: shopping_cart_id
 */

static async findShoppingCart(userId){
    const result = await db.query( 
        `SELECT shopping_cart_id, store_name
        FROM shopping_cart
        WHERE (user_id = $1 AND is_closed = $2)
        RETURNING shopping_cart_id`,
        [userId, false]
    );

    return result.rows[0];
}


/** Close a shopping cart for User (after checkout)
 * Another shopping cart will be created and attached to user
 * 
 * @returns: shopping_cart_id of new shopping cart
 */

static async closeShoppingCart(user){

//search for shopping cart with isClosed as false
const shoppingCartToClose = users.findShoppingCart(user.user_id);

//then set isClosed for that particular shopping cart (got above) to true
const setClosed = await db.query( 
    `UPDATE shopping_cart
    SET is_closed = $1
    WHERE shopping_cart_id = $2
    RETURNING shopping_cart_id, is_closed`,
    [true, shoppingCartToClose]
);

//create a new shopping cart with isClose as false for user_id
const setNewShoppingCart = await db.query( 
    `INSERT INTO shopping_cart
    (user_id)
    VALUES ($1)
    RETURNING user_id, shopping_cart_id, is_closed`,
    [user.user_id]
);

//return new shopping_cart_id
return setNewShoppingCart.rows[0].shopping_cart_id;
}




/** Add an item to current shopping cart for User
 * 
 * @returns itemId
 */
static async addItem(user, itemId, store_name){

    //getting user's current opened shopping cart id
    const userShoppingCart = user.shopping_cart_id;

    const addItem = await db.query( 
        `INSERT INTO item
        (shopping_cart, store_name)
        VALUES ($1, $2)
        RETURNING item_id`,
        [userShoppingCart, store_name]
    );

    return addItem.rows[0];

}

/** Delete an item to current shopping cart for User
 * 
 * @returns "successful" if successful, otherwise "not successful"
 */
 static async deleteItem(user, itemId, store_name){

    try{
    //getting user's current opened shopping cart id
    const userShoppingCart = user.shopping_cart_id;

    const deleteItem = await db.query( 
        `DELETE FROM item
        WHERE (shopping_cart = $1 AND store_name = $2)`,
        [userShoppingCart, store_name]
    );

    return "successful";
}catch(error){
    return "not successful";
}
}

/**Get User's Shopping Cart with list of items within
 * @params user_id
 * @returns [{item_id, shopping_cart_id, store_name},...]
*/

static async getAllItemsForCurrentCart(user){
    //const user_id = user.user_id;

    const allItems = await db.query(
        `SELECT item.item_id, item.store_name, item.shopping_cart, shopping_cart.user_id
        FROM item
        RIGHT JOIN ON shopping_cart 
        WHERE (item.shopping_cart = $1 AND shopping_cart.user_id = $2 AND shopping_cart.is_closed = $3)`,
        [user.shopping_cart_id, user.user_id, false]
    );

    return allItems.rows;
}
}

module.exports = User;