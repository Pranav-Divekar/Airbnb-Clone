const express = require("express");
const router = express.Router(); 
const mongoose = require("mongoose");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

const passport=require("passport");
const UserController = require("../controllers/users.js");


router.get("/signup",UserController.signup);

router.post("/signup",wrapAsync(UserController.login));

router.get("/login",UserController.loginPage);

// router.post("/login",saveRedirectUrl,
// passport.authenticate('local',{
//     failureRedirect:"/login",
//     failureFlash:true
// }),
//  async(req,res)=>{
//     req.flash("success","Logged In");
//     res.redirect(req.session.redirectUrl);
// });

const { saveRedirectUrl } = require("../middleware.js");

router.post("/login", saveRedirectUrl, passport.authenticate('local', {
    failureRedirect: "/login",
    failureFlash: true
}), UserController.loginFlash);


router.get("/logout",UserController.logout);


module.exports=router;