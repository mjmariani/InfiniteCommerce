//Source: Springboard (parts were leveraged from springboard other projects)

"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");

const User = require("../models/users");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const registerUserSchema = require("../schemas/registerUser.json");
const { BadRequestError } = require("../expressError");

/** POST /auth/token: {username, password} => {token}   
 * 
 * returns JWT token which can be used to authenticate further requests.
 * 
 * authorization required: none
 */

router.post("/token", async function (req, res, next){
    try{
        //validate the json sent through the req.body.data per the userAuthSchema
        const validator = jsonschema.validate(req.body.data, userAuthSchema);
        if(!validator.isValid){
            //if not valid, then get errors obj and create a new array mapping each error.stack to the new array
            const errs = validator.errors.map(e => e.stack);
            //pass the errs array into the BadRequestError constructor and throw the error
            throw new BadRequestError(errs);
        } 

        //if json sent is valid, authenticate the username and password by passing them into the User.authenticate static method
        const {username, password} = req.body;
        const user = await User.authenticate(username, password);
        //once authenticated, pass the user to the createToken 
        const token = createToken(user);
        return res.json({ token });

    }catch(err){
        //any errors thrown will caught and sent to next error handler
        return next(err);
    }

});

/** POST /auth/register: {user} => {token}
 * 
 * user must include { username, password, firstName, lastName, email }   
 * 
 * returns JWT token which can be used to authenticate further requests.
 * 
 * Authorization required: none
 */

router.post("/register", async function (req, res, next){
    try{
        //validate the json req sent for registering a user
        const validator = jsonschema.validate(req.body, registerUserSchema);
        if(!validator.isValid){
            //if not valid, throw error
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        //if json is valid, register new user and pass in the isAdmin attribute as false
        const newUser = await User.register({...req.body, isAdmin: false});
        //once authenticated and no error is thrown, then create token
        const token = createToken(newUser);
        //send a res with a status code of 201 and a json request with the token
        return res.status(201).json({token});
    }catch(err){
        return next(err);
    }
})

module.exports = router;