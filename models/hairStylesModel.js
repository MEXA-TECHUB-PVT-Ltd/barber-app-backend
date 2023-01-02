
const  mongoose = require("mongoose");

const hairStyleSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name:String,
    price:String,
    image:String,    

})

module.exports = mongoose.model('hairStyle' , hairStyleSchema);

