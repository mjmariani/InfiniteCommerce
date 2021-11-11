/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
//middleware to ensure user is admin or is correct user || isAdmin
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/users");
//helper method to create JWT tokens
const { createToken } = require("../helpers/tokens");
const newUserSchema = require("../schemas/registerUser.json");
const editUserSchema = require("../schemas/editUser.json");
const { json } = require("body-parser");

const router = express.Router();

/** POST / { user } => { user, token }
 * 
 * Adds a new user. 
 * 
 * Note: this is for admin users only and is not a registration endpoint. 
 * Admins can use this post request to add new admin users.
 * 
 * This returns the newly created user and authentication token for the new user 
 * {user: {user_id, username, firstName, lastName, email, isAdmin, shopping_cart_id}, token }
 * 
 * Authorization is required by another admin
 */

router.post("/", ensureAdmin, async function (req, res, next){
    try{
        const validator = jsonschema.validate(req.body, newUserSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //register new user
        //console.log(req.body);
        
        const user = await User.register(req.body);
        //if no errors are thrown, then create token for new user
        const token = createToken(user);
        //return res with status 201 and a json response with user obj and token
        return res.status(201).json({user, token});
    }catch(err){
        //if error is caught, pass to next error handler
        return next(err);
    }
});

/** GET / => { users: [ {username, first_name, last_name, email, is_admin }, ...]}   
 * 
 * Returns list of all users
 * 
 * Authorization is required by admin
 */

router.get("/", ensureAdmin, async function (req, res, next){
    try{
        //use user model API to retrieve all users from database
        const users = await User.findAll();
        return res.json( { users });
    }catch(err){
        return next(err);
    }
});

/** GET /[username] => { users }
 * 
 * returns { username, first_name, last_name, is_admin, shopping_cart_id }
 *  
 * Throws NotFoundError if user not found.
 * 
 * Authorization required: admin or same user as: username
 */

router.get("/:username", ensureCorrectUserOrAdmin, async function (req, res, next){
    try{
        //retrieve user from the database
        const user = await User.get(req.params.username);
        //return json obj of user for username
        return res.json({ user });
    }catch (err){
        return next(err);
    }
})

/** PATCH /[username] { user } => { user }
 * 
 * Data can include: { firstName, lastName, password, email }
 * 
 * Returns { username, firstName, lastName, email, isAdmin }
 * 
 * Throws NotFoundError if not found.
 * 
 * Authorization required: admin or same user as: username
 */

router.patch("/:username", ensureCorrectUserOrAdmin, async function (req, res, next){
    try{
        //validate json request sent
         const validator = jsonschema.validate(req.body, editUserSchema);
         if(!validator.valid){
             const errs = validator.errors.map(e => e.stack);
             throw new BadRequestError(errs);
         }

        const user = await User.update(req.params.username, req.body);
        return res.json({ user });
    }catch(err){
        return next(err);
    }
});

/** DELETE /[username] => { deleted: username }
 * 
 * Authorization required by either the admin or same user as: username
 */

router.delete("/:username", ensureCorrectUserOrAdmin, async function (req, res, next){
    try{
        await User.remove(req.params.username);
        return res.json({ deleted: req.params.username });
    }catch(err){
        return next(err);
    }
})


/** GET /[username]/[user_id]/shoppingcart => { shopping_cart_id, items: [ {item_id, store_name }, ... ]}  
 * 
 * Get all items in shopping cart for a user
 * 
 * @params: username, user_id
 * @returns: { shopping_cart_id, items: [ {item_id, shopping_cart_id, store_name, asin, quantity }, ... ]} 
 * 
 * Authorization required by either the admin or same as user as: username
 */

router.get("/:username/:user_id/shoppingcart", ensureCorrectUserOrAdmin, async function (req, res, next){
    try{
        const shopping_cart_id = await User.findShoppingCartByUserId(req.params.user_id);
        const items = await User.getAllItemsForCurrentCart(req.params.user_id, shopping_cart_id);
        return res.json({ shopping_cart_id, items });
    }catch(err){
        return next(err);
    }

});

/** POST /[username]/[user_id]/shoppingcart/[store_name]/[asin] => { shopping_cart_id, items: [ {item_id, store_name, shopping_cart_id, asin, quantity }, ... ]}
 * 
 * Add an item to a user's shopping cart
 * @params: username, user_id, store_name, asin
 * @returns: { shopping_cart_id, items: [ {item_id, store_name, shopping_cart_id }, ... ]} 
 * 
 * Authorization required by either the admin or same as user as: username
 */

router.post("/:username/:user_id/shoppingcart/:store_name/:asin", ensureCorrectUserOrAdmin, async function (req, res, next){
    try{
        const shopping_cart_id = await User.findShoppingCartByUserId(req.params.user_id);
        const item = await User.addItem(shopping_cart_id, req.params.store_name, req.params.asin );
        const items = await User.getAllItemsForCurrentCart(req.params.user_id,shopping_cart_id);
        return res.json({ shopping_cart_id, items });

    }catch(err){
        return next(err);
    }
});

/** POST /[username]/[user_id]/shoppingcart/[store_name]/[asin]/[quantity] => { shopping_cart_id, items: [ {item_id, store_name, shopping_cart_id, asin, quantity }, ... ]}
 * 
 * Update quantity of an item to a user's shopping cart
 * @params: username, user_id, store_name, asin, quantity
 * @returns: { itemId, quantity, asin } 
 * 
 * Authorization required by either the admin or same as user as: username
 */
 router.post("/:username/:user_id/shoppingcart/:store_name/:asin/:quantity", ensureCorrectUserOrAdmin, async function (req, res, next){
    try{
        const shopping_cart_id = await User.findShoppingCartByUserId(req.params.user_id);
        const addItem = await User.updateQuantityOfItem(shopping_cart_id, req.params.asin, req.params.store_name, req.params.quantity);
        return res.json({addItem});
    }catch(err){
        return next(err);
    }

 });

/** DELETE /[username]/[user_id]/shoppingcart/[store_name]/[asin] => "successful" if successful, otherwise "not successful"
 * 
 * Delete an item to a user's shopping cart
 * @params: username, user_id
 * @returns: "successful" if successful, otherwise "not successful" 
 * 
 * Authorization required by either the admin or same as user as: username
 */

router.delete("/:username/:user_id/shoppingcart/:store_name/:asin", ensureCorrectUserOrAdmin, async function (req, res, next){
    try{
        const shopping_cart_id = await User.findShoppingCartByUserId(req.params.user_id);
        const delete_item = await User.deleteItem(shopping_cart_id, req.params.asin, req.params.store_name);
        return res.json({ delete_item });
    }catch(err){
        next(err);
    }
});

/** POST /[username]/[user_id]/shoppingcart => (new shopping cart) { new_shopping_cart_id, items: [ {item_id, store_name }, ... ]}
 * 
 * Checkout one shopping cart (close current shopping cart) and create a new shopping cart automatically
 * @params: username, user_id
 * @returns: { shopping_cart_id, items: [ {item_id, store_name }, ... ]}
 */

router.post("/:username/:user_id/shoppingcart", ensureCorrectUserOrAdmin, async function (req, res, next){
    try{
        const new_shopping_cart_id = await User.closeShoppingCartByCartId(req.params.user_id);
        const items = await User.getAllItemsForCurrentCart(req.params.user_id,new_shopping_cart_id);
        return res.json({ new_shopping_cart_id, items });
    }catch(err){
        return next(err);
    }
});

module.exports = router;