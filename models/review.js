const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    project: {  // Added reference to the associated project
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    }
});

module.exports = mongoose.model("Review", reviewSchema);
