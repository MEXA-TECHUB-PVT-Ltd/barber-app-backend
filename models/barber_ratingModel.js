
const mongoose =require("mongoose");

const barber_rating = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    customer_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"

    },
    barber_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    review:String,
    stars_rate:Number,
    
},
{
    timestamps:true
})

module.exports =mongoose.model("barber_rating" , barber_rating)