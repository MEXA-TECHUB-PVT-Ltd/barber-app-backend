
const mongoose = require('mongoose');

const e_walletSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    user_id : {
        type:String,
        ref: 'user',
        unique: true
    } , 
    available_amount_to_withdraw: {
        type:Number, 
        default: 0
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transaction',
      }],
})

module.exports = mongoose.model("e_wallet" , e_walletSchema);

