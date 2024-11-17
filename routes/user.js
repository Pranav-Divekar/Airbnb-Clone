const express = require("express");
const router = express.Router(); 
const mongoose = require("mongoose");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const UserController = require("../controllers/users.js");
const { saveRedirectUrl } = require("../middleware.js"); // Ensure correct middleware import

// Route to render the signup form
router.get("/signup", UserController.signup);

// Route to handle user signup form submission
router.post("/signup", wrapAsync(UserController.createUser));  // Renamed controller method for clarity

// Route to render the login page
router.get("/login", UserController.loginPage);

// Route to handle login form submission with redirection
router.post("/login", saveRedirectUrl, passport.authenticate('local', {
    failureRedirect: "/login",
    failureFlash: true
}), UserController.loginFlash);

// Route to handle user logout and redirect to homepage
router.get("/logout", UserController.logout);

module.exports = router;
