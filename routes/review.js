const express = require("express");
const router = express.Router({mergeParams:true}); // using this allows parent parameters from /listings/:id/reviews" accessible here too
const mongoose = require("mongoose");
const wrapAsync = require("../utils/wrapAsync.js");
const schemavalidate = require("../schemaforvalidate.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const listing = require("../models/listing");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js"); 
const reviewController = require("../controllers/reviews.js");



router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview));


router.delete("/:rev_id",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;