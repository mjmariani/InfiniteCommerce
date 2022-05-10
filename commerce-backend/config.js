//Source: Springboard
//with minor updates

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

//'+' casts PORT to integer
const PORT = +process.env.PORT || 3001;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
        ? "postgresql:///commerce_test"
        : process.env.DATABASE_URL || "postgresql:///commerce";
  }
  
  // Speed up bcrypt during tests, since the algorithm safety isn't being tested
  //
  // WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
  const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;
  
  console.log("Commerce Config:".green);
  console.log("SECRET_KEY:".yellow, SECRET_KEY);
  console.log("PORT:".yellow, PORT.toString());
  console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
  console.log("Database:".yellow, getDatabaseUri());
  console.log("Environment:".yellow, process.env.NODE_ENV);
  console.log("---");

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
};