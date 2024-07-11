const mongoose  = require("mongoose");
const listing = require("../models/listing");
const initdata = require("./data.js"); 
main()
.then(()=>{
    console.log("Connection succelsull with mongoose");
})
.catch((err)=>{
    console.log(err);
});
async function main()
{
    await mongoose.connect("mongodb://127.0.0.1:27017/Airbnb");
}

const initdb = async()=>{
    await listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"667907316ca28a8be0b76dd6"}));
    await listing.insertMany(initdata.data);
}
initdb();