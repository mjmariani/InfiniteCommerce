//Source: Springboard (parts were leveraged from springboard other projects)

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
        const validator = jsonschema.validate(req.body, userAuthSchema);
        if(!validator.valid){
            //if not valid, then get errors obj and create a new array mapping each error.stack to the new array
            const errs = validator.errors.map(e => e.stack);
            //pass the errs array into the BadRequestError constructor and throw the error
            //throw new BadRequestError(errs);
            return res.status(400).json("username or password of wrong data type")
        } 

        //if json sent is valid, authenticate the username and password by passing them into the User.authenticate static method
        //console.log(req.body)
        const {username, password} = req.body;
        if(!username || !password){
            //throw new BadRequestError(errs);
            return res.status(400).json("Missing username or password");
        }
        
        const user = await User.authenticate(username, password);
        if(!user){
            //throw new UnauthorizedError();
            return res.status(401).json("Invalid Username and Password");
        }
        //once authenticated, pass the user to the createToken 
        const token = createToken(user);
        return res.status(200).json({ token });

    }catch(err){
        //any errors thrown will be caught and sent to next error handler
        next();
        //return res.status(401).json("Invalid Username and Password");
    }

});

/** POST /auth/register: {user} => {token}
 * 
 * user must include { username, password, first_name, last_name, email }   
 * 
 * returns JWT token which can be used to authenticate further requests.
 * 
 * Authorization required: none
 */

router.post("/register", async function (req, res, next){
    try{
        //validate the json req sent for registering a user
        const validator = jsonschema.validate(req.body, registerUserSchema);
        if(!validator.valid){
            //if not valid, throw error
            const errs = validator.errors.map(e => e.stack);
            //console.log(errs);
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