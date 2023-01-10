const mongoose = require('mongoose');

const admin_saleSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    appointment_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"appointment"
    },
    transaction_id:String,
    commission_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"commission"
    }
})

module.exports = mongoose.model ("admin_sales" , admin_saleSchema)

