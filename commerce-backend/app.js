/** Express app for commerce app. */

const express = require('express');
//middleware used to enable CORS
//look at this site for more info: https://www.section.io/engineering-education/how-to-use-cors-in-nodejs-with-express/ 
const cors = require("cors");
const { NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("./middleware/auth");

//importing of routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

//to log request details
//details: https://www.npmjs.com/package/morgan
const morgan = require("morgan");

const app = express();

//allow CORS
app.use(cors());
// Parse request bodies for JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authenticateJWT);
app.use(morgan('dev'));

//routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
    //if not in testing environment
    if (process.env.NODE_ENV !== "test") { 
    console.error(err.stack);
    }
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
    error: { message, status },
    });
});

module.exports = app;