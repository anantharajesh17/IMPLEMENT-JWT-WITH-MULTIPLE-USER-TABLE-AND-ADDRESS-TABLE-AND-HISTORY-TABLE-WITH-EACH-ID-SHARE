const mongoose = require('mongoose');
// const userAddress = require("./userAddress")

const addressSchema = new mongoose.Schema({
    location:{
        type:String,
        enum:['home', 'office', 'college'],
        required:true,
    },
    address:String,
    city:String,
    state:String,
    country:String,
    street:String,
    pincode:String,
    flatno:String,
    houseno:String,
    buildno:String,
    isActive:{
        type:Boolean,
        default:true
    },
},
{
    timestamps:true,
});
const userAddress = mongoose.model('userAddress',addressSchema);

module.exports = userAddress;