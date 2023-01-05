
const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    user_name:String,
    email:String,
    password:String,
    blockStatus:{
        type:Boolean,
        default:false,
    },
    age:String,
    experience:String,
    gender:{
      type : String,
      enum:[
        "male",
        "female",
        "preferNotToSay"
      ]
    },

    device_token:String,
    photo :String,
    payment_info:String,
    user_type:{
        type:String,
        enum:["customer" , "barber"]
    },
    location: {
        type: { 
         type: String,
         default: "Point"
       },
        coordinates: {
          type: [Number], 
          default: undefined
       } 
     },
    
 
    
})

userSchema.index( { location : "2dsphere" } );

module.exports=mongoose.model("user" , userSchema);

