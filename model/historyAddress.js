const mongoose = require('mongoose');

const historyAddressSchema = new mongoose.Schema({
    address_id:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'userAddress',
        },
    user_id:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
        },
    createdAt: {
        type: Date,
        default: Date.now()
      },
      updatedAt: {
        type: Date,
        default: Date.now()
      },
    isActive:{
        type:Boolean,
        default:true
    },
});
module.exports = mongoose.model('historyAddress',historyAddressSchema);