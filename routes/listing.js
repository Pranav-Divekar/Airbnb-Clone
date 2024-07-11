require('dotenv').config();
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const schemavalidate = require("../schemaforvalidate.js");
const listing = require("../models/listing");
const mongoose = require("mongoose");
const {isLoggedIn,isOwner,validatelisting} = require("../middleware.js"); 
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


//path is /listings/edit or delete etc
// but as we are in listing.js we dont mention /listing

//this method when we have same paths but different methods
// router
// .route("/")
// .get(wrapAsync(listingController.index ))
// .put(validatelisting, wrapAsync(listingController.createNewListing));

// router
// .route("/:id")
// .get(wrapAsync(listingController.showListing))
// .patch(validatelisting,isLoggedIn, isOwner,wrapAsync(listingController.updateListing))
// .delete(isLoggedIn,isOwner,wrapAsync(listingController.deletelisting));



router.get("/", wrapAsync(listingController.index ));

router.get("/new", isLoggedIn,listingController.renderNewForm);

router.get("/:id", wrapAsync(listingController.showListing));

router.put("/",upload.single("listing[image]"), wrapAsync(listingController.createNewListing));

router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.edit));

router.patch("/:id",upload.single("listing[image]"),validatelisting,isLoggedIn, isOwner,wrapAsync(listingController.updateListing));

router.delete("/:id", isLoggedIn,isOwner,wrapAsync(listingController.deletelisting));

module.exports=router;