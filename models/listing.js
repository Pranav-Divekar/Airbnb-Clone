const mongoose  = require("mongoose");
const Schema=mongoose.Schema;
const Review = require("./review.js");

const listSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
      url:String,
      filename:String
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    reviews : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    geometry : {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
});

//having a mongoose middle ware, will be called when any listing is being deleted
//to delete reviews of deleting listing, from reviews database
listSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
   
});

const listing = mongoose.model("listing",listSchema);

module.exports=listing;