
const  mongoose = require("mongoose");

const hairStyleSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name:String,
    price:String,
    image:String, 
    addedBy: {
        type:String,
        enum:["admin" , "barber"]
    } ,
    barber_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    }  

})

module.exports = mongoose.model('hairStyle' , hairStyleSchema);

