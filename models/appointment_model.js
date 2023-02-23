const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    _id:mongoose.Schema .Types.ObjectId,
    customer_id:{
        type:mongoose.Schema .Types.ObjectId,
        ref: "user"
    } , 
    hair_style_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "hairStyle"
    },
    barber_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    pay_to_admin:{
       type:Object
    },
    work_day_for_shop_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "work_day_for_shop"
    },
    work_day_for_shop_timing_id :{
        type:mongoose.Schema.Types.ObjectId,
        ref: "work_day_for_shop_timing"
    },
    appointment_date:String,
    status:{
        type:String,
        enum:[
            "pending",
            "scheduled",
            "cancelled",
            "completed"
        ],
        default: "pending"
    },
    req_status:{
        type:String,
        enum:["accepted" , "rejected" , "requested"],
        default:"requested"
    },
    cancelled_by: {
        type:String,
        enum:['barber' , 'customer'],
    },
    cancelling_reason : {
        type:String,
        default:null
    },
    completion_images:{
        type:Array
    }
},{
    timestamps:true
})

module.exports = mongoose.model("appointment" , appointmentSchema)