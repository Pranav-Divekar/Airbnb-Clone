const Review = require("../models/review.js");
const listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");

module.exports.createReview = async(req,res)=>{
    let {id} = req.params;
    let review = new Review(req.body.review);
    review.author=req.user._id;
    let list = await  listing.findById(id);
    list.reviews.push(review);

    let rev  = await review.save();
    let li = await list.save();
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async(req,res)=>{
    let {id,rev_id}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:rev_id}});
    await Review.findByIdAndDelete(rev_id);
    res.redirect(`/listings/${id}`);
}