const mongoose = require('mongoose');
 
const schema = mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    },
    address_id:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'userAddress',
        },]
    },
  {
    timestamps: true,
  });

const user = mongoose.model('user',schema);
// console.log("kkk")
module.exports = user;