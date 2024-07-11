//contains callbacks
const ExpressError = require("../utils/ExpressError.js");
const listing = require("../models/listing");
const mongoose = require("mongoose");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); 


module.exports.index = async (req, res) => {
    const alllisting = await listing.find({});
    res.render("listing/index", { alllisting });
};

module.exports.renderNewForm=(req, res) => {
    res.render("listing/new");
}; 

module.exports.showListing = async (req, res,next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        next(new ExpressError(500,"Invalid Id"));
    }
    const listdata = await listing.findById(id).populate({path:"reviews",
    populate:{path:"author"}
    }).populate("owner");
    if(!listdata){
        req.flash("error","No such listing exists");
        res.redirect("/listings");
    }
    console.log(listdata);
    res.render("listing/show", { listdata });
}

module.exports.createNewListing = async (req, res,next) => {
    // if(!req.body.listing){
    //     next(new ExpressError(400,"Body Missing"));
    // }
    //not needed cuz validateListing we have

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location +','+ req.body.listing.country,
        limit: 1
      })
        .send();
    
    console.log(response);
        
    let url = req.file.path;
    let filename = req.file.filename;
    req.flash("success","New listing created");
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    let newlist = await newListing.save(); 
    console.log(newlist);
    res.redirect("/listings");
}

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid ID");
    }
    const listings = await listing.findById(id);
    res.render("listing/edit", { listings });
}

module.exports.updateListing = async (req, res) => {

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid ID");
    }
    const data = req.body.listing;
    let list = await listing.findByIdAndUpdate(id, data);

    //if during editing user provides a new image only then, update image
    if(typeof req.file !== "undefined")
    {
        let url = req.file.path;
        let filename = req.file.filename;
    
        list.image = {url,filename};
        await list.save();
    }
    req.flash("success","Listing was updated");
    res.redirect(`/listings/${id}`);
}

module.exports.deletelisting = async (req, res) => {
    console.log("Request received");
    const { id } = req.params;
    req.flash("success","Listing was deleted");
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}