
const  mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    commission_in_percentage:Number ,
    active:{
        type:Boolean,
    },

})

module.exports = mongoose.model('commission' , commissionSchema);

