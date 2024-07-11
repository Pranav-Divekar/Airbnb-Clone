const mongoose  = require("mongoose");
const { use } = require("passport");
const Schema=mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String, 
        required:true
    }
});

//added passport-local-mongoose as plugin once schema defined
userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);