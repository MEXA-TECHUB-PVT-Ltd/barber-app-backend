
const mongoose = require("mongoose");

const work_day_for_shop_timingSchema = new mongoose.Schema ({
    _id:mongoose.Schema.Types.ObjectId,
    workDay_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"work_day_for_shop"
    },
    start_time:{
        type:String
    },
    end_time:{
        type:String
    },
},
{
    timestamps:true,
})

module.exports = mongoose.model("work_day_for_shop_timing" , work_day_for_shop_timingSchema)