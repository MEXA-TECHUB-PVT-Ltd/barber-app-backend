
const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema(
  {
    _id:mongoose.Schema.Types.ObjectId,
    from:{
        type:String,
        enum:["customer" , "barber" , "system"]
    },
    to:{
        type:String,
    },
    message: String,
    notification_type:{
        type:String,
        enum:[
         "accept_appointment" , "new_hairStyle_added" ,"reject_appointment", "refund" , 'cancels_appointment' , 'completes_appointment'
        ]
    }
  },
  {
    timestamps: true,
  }
);

const privacyPolicyModel = mongoose.model("notification", notificationSchema);
module.exports=privacyPolicyModel

