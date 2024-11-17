const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const projectRouter = require("./routes/project.js"); // Renamed from listingsRouter
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const dburl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/FFinalYearProjectManagment";

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET || "defaultsecret",
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("Error in Mongo store", err);
});

app.use(
    session({
        store,
        secret: process.env.SECRET || "defaultsecret",
        resave: false,
        saveUninitialized: true,
        cookie: {
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        },
    })
);

app.use(flash());

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});

main()
    .then(() => {
        console.log("Connection successful with Mongoose");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dburl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: false, // Disable SSL for local connection
        serverSelectionTimeoutMS: 30000, // 30 seconds timeout
    });
    console.log("Connected to MongoDB");
}

app.get("/", (req, res) => {
    res.render("root.ejs");
});

// Routes
app.use("/projects", projectRouter); // Updated from "listings"
app.use("/projects/:id/reviews", reviewsRouter); // Re-routed reviews
app.use("/", userRouter);

// Error Handling
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    res.render("./error.ejs", { err });
});
