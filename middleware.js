const listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const schemavalidate = require("./schemaforvalidate.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl=req.orignalUrl;
        req.flash("error","Login is required");
        res.redirect("/login");
    }
    next(); 
};

//middleware that saves url from whre user was was prompted to login, to avoid inconvinience and redirecting user to that specicif page
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

 //this logic is cuz if anyone tries to send req through postman or hoppscoth for edit
module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let l = await listing.findById(id);
    if(!l.owner.equals(res.locals.currUser._id))
    {
        req.flash("error","You are not authorized to make changes");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {rev_id,id} = req.params;
    let l = await Review.findById(rev_id);
    if(!l.author.equals(res.locals.currUser._id))
    {
        req.flash("error","You cannot delete");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.validatelisting = (req,res,next)=>
{   let result = schemavalidate.listSchema.validate(req.body);
    console.log(result);
    if(result.error)
    {
        next(new ExpressError(500,"Incorrect data"));
    }
    else{
        next();
    }

}

module.exports.validateReview = (req,res,next)=>
{   let result = schemavalidate.reviewSchema.validate(req.body);
    console.log(result);
    if(result.error)
    {
        next(new ExpressError(500,"Incorrect Review"));
    }
    else{
        next();
    }

}