const User = require("../models/user.js");
const mongoose = require("mongoose");
const ExpressError = require("../utils/ExpressError.js");

module.exports.signup=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.loginPage=async(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    try{
        let{username,email,password} = req.body;
        const newUser = new User({email,username});
        let registeredUser = await User.register(newUser,password);
        //login signed up user
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome !!");
            res.redirect("/listings");
        })
    }
    catch(e)
    {
        req.flash("error",e.message);
        res.redirect("./users/signup");
    }
}


module.exports.loginFlash=async (req, res) => {
    req.flash("success", "Logged In");
    res.redirect(req.session.redirectUrl || "/listings"); // Added a fallback to "/" if redirectUrl is not set
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err)
        {
            return next(err);
        }
        req.flash("success","Logged Out Succesfully");
        res.redirect("/listings");
    });
}