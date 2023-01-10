
const mongoose = require("mongoose");

const hairStylePriceModel = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    unique_id:String,
    price:String,
})

module.exports = mongoose.model("hairStylePrice" , hairStylePriceModel)