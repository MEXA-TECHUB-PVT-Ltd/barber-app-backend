
const mongoose = require("mongoose");

const work_day_for_ShopSchema = new mongoose.Schema ({
    _id:mongoose.Schema.Types.ObjectId,
    barber_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    day:{
        type:String,
        enum:["sunday" , "monday" , "tuesday" , "wednesday" , "thursday" , "friday" , "saturday"],
    },
},
{
    timestamps:true,
})

module.exports = mongoose.model("work_day_for_shop" , work_day_for_ShopSchema)