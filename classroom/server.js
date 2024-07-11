const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(session({secret:"mysecretcode",
resave:false,
saveUninitialized:true
}));

app.use(flash());

app.listen(8080,()=>{
    console.log("Listening....");
});

app.get("/tests",(req,res)=>{
    req.flash("name","Pranav Divekar");
    let{name}=req.query;
    console.log(req.flash("name"));
    res.render("home.ejs",{name,msg:req.flash("name")});
});

app.get("/tests1",(req,res)=>{
    req.flash("name","Pranav Divekar");
    let{name}=req.query;
    console.log(req.flash("name"));
    res.render("home.ejs",{name:req.session.name,msg:req.flash("name")});
});
