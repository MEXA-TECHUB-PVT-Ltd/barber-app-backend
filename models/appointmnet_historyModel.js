
const mongoose = require("mongoose")

const appointmentHistorySchema= new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    appointment_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"appointment"
    },
    transaction_id:String,
    transaction_status:{
        type:String,
        enum:["success", "failed"],
    },
    customer_id:{
        type:String,
        ref: "user"
    }
    ,
    barber_id:{
        type:String,
        ref: "user"
    }

})

module.exports = mongoose.model("appointment_history", appointmentHistorySchema);