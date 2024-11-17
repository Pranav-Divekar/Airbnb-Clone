const User = require("../models/user.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.signup = (req, res) => {
    res.render("users/signup.ejs");  // Render the signup form
};

module.exports.loginPage = async (req, res) => {
    res.render("users/login.ejs");  // Render the login page
};

module.exports.login = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        let registeredUser = await User.register(newUser, password);  // Register the user

        // Log in the signed-up user
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome!");
            res.redirect("/projects");  // Redirect to projects page after successful login
        });
    } catch (e) {
        req.flash("error", e.message);  // Handle errors during registration
        res.redirect("/signup");  // Redirect back to the signup page if an error occurs
    }
};

module.exports.loginFlash = async (req, res) => {
    req.flash("success", "Logged In Successfully!");
    res.redirect(req.session.redirectUrl || "/projects");  // Redirect to the originally requested page or projects page
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged Out Successfully!");
        res.redirect("/projects");  // Redirect to the projects page after logging out
    });
};
