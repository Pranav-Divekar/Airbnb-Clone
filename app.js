//commented part has been shifted from app.js to /routes 
//routes folder does task of rerouting
//below code is short and crisp

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const User = require("./models/user");
const passport = require("passport");
const LocalStatergy = require("passport-local");
const dburl = process.env.ATLASDB_URL;
const local_mongoURL = "mongodb://127.0.0.1:27017/Airbnb";

const store = MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("Error in mongo store",err);
});

app.use(session({
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() * 7*24*60*60*1000, // will expire after 7 days
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
})); 

app.use(flash());

app.engine("ejs",ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname,"/public")));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStatergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

const port = 8080;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});

main().then(() => {
    console.log("Connection successful with mongoose");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dburl,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
        tlsAllowInvalidCertificates: true  // Add this option for testing purposes
    });
}

app.get("/", (req, res) => {
    res.render("root.ejs");
});

//was for testing purpose
// app.get("/demouser",async (req,res)=>{
//     let fakeUser= new User({
//         email:"abc@gmail.com",
//         username:"abc"
//     }); 

//     let result = await User.register(fakeUser,"password");
//     res.send(result);
//     console.log(result);
// });


// *********************************************
//whenever we'll receive request for /listing we will use required listing;

app.use("/listings",listingsRouter);


//reviews has aslo been re-routed
app.use("/listings/:id/reviews",reviewsRouter);
///listings/:id/reviews" this is Parent route, hence when we'll merge it with child route of review then
//parameter :id will not be accessble there, hence we write "mergeparams" const router = express.Router({mergeParams:true});
//to access parent parameters to child

app.use("/",userRouter);
 
// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page Not Found"));
// });

app.use((err,req,res,next)=>{
    //let {statusCode=500,message="Some Error"} = err;
    //res.status(statusCode).send(message);
    res.render("./error.ejs",{err});
});

