const mongoose = require("mongoose")
const appointment_historyModel = require("../models/appointmnet_historyModel")
const userModel = require("../models/userModel")



exports.createAppointmentHistory= async(req,res)=>{
    try{
        const appointment_id = req.body.appointment_id;
        const transaction_id = req.body.transaction_id;
        const transaction_status = req.body.transaction_status;
        const customer_id = req.body.customer_id;
        const barber_id = req.body.barber_id;

        if(!appointment_id || !transaction_id || !transaction_status || !customer_id || !barber_id ){
            return res.status(400).json({
                error: "Missing appointment_id, transaction_id, transaction_status, customer_id , barber_id"
            })
        }

        const barber = await userModel.findOne({_id: barber_id , user_type: 'barber'});
       if(!barber){
        return (
            res.json({
                 message: "It seems Barber with this id does not exists",
                status:false
            })
        )
      }


      const customer = await userModel.findOne({_id: customer_id , user_type: 'customer'});
       if(!customer){
        return (
            res.json({
                 message: "It seems customer with this id does not exists",
                status:false
            })
        )
      }
        const appointment_history = new appointment_historyModel({
            _id:mongoose.Types.ObjectId(),
            appointment_id:appointment_id,
            transaction_id:transaction_id,
            transaction_status:transaction_status,
            customer_id:customer_id,
            barber_id:barber_id

        })
        const result = await appointment_history.save();

        if(result){
            res.json({
                message: "Appointment history saved successfully",
                result:result,
                statusCode:200
            })
        }
        else{
            res.json({
                message: "Could not save appointment history",
                result:result,
                statusCode:404
            })
        }
    }
    catch(err){
        res.json({
            message: "Error",
            error:err.message
        })
    }
}
exports.getAllAppointmentHistories =async  (req,res)=>{
    try{
        const result = await appointment_historyModel.find().populate("appointment_id").populate("customer_id").populate("barber_id");
        if(result){
            res.json({
                message : "Fetched appointment histories ",
                result:result,
                statusCode:200
            })
        }else{
            res.json({
                message: "Could not fetched history",
                result:null,
                statusCode:404
            })
        }

    }
    catch(err){
        res.json({
            message: "Error",
            error:err.message,
            status:false
        })
    }
}

// exports.getAppointmentHistoryByAppointmentId= async(req,res)=>{
//     try{
//         const appointment_id = req.query.appointment_id;

//         if( !appointment_id ){
//             return res.status(400).json({
//                 error: "Missing appointment_id"
//             })
//         }
//         const result= await appointment_historyModel.find({appointment_id:appointment_id}).populate("appointment_id");
//         if(result){
//             res.json({
//                 message : "Fetched appointment history by this appointment id.",
//                 result:result,
//                 statusCode:200
//             })
//         }else{
//             res.json({
//                 message: "Could not fetched history",
//                 result:null,
//                 statusCode:404
//             })
//         }
//     }
//     catch(err){
//         res.json({
//             message: "Error",
//             error:err.message
//         })
//     }
// }

exports.deleteAppointmentHistory = async (req ,res)=>{
    try{
        const appointment_history_id =req.query.appointment_history_id;
        if( !appointment_history_id ){
            return res.status(400).json({
                error: "Missing appointment_history_id",
                status:false
            })
        }
        const result= await appointment_historyModel.deleteOne({_id:appointment_history_id});
        if(result.deletedCount>0){
            res.json({
                message: "appointment history was successfully deleted",
                result:result,
                statusCode:200
            })
        }
        else{
            res.json({
                message: "could not delete appointment history",
                result:result
            })
        }
    }
    catch(err){
        res.json(err);
    }
}


exports.updateAppointmentHistory = async (req,res)=>{
    try{
        const appointment_history_id= req.body.appointment_history_id;
        const appointment_id = req.body.appointment_id;
        const transaction_id = req.body.transaction_id;
        const transaction_status = req.body.transaction_status;

        if( !appointment_history_id ){
            return res.status(400).json({
                error: "Missing appointment_history_id",
                status:false
            })
        }

        const result = await appointment_historyModel.findOneAndUpdate({_id:appointment_history_id} , 
            {
                appointment_id:appointment_id,
                transaction_id:transaction_id,
                transaction_status:transaction_status
            },
            {
                new:true
            }
            );

            if(result){
                res.json({
                    message: "updated successfully",
                    result:result,
                    statusCode:200
                })

            }
            else{
                res.json({
                    message: "could not be updated successfully",
                    result:null
                })
            }
        
    }
    catch(err){
        console.log(err)
        res.json({
            message: "error occurred",
            error:err.message
        })
    }
}

exports.getAppointmentHistoryOfCustomer= async(req,res)=>{
    try{
        const customer_id = req.query.customer_id;
        if( !customer_id ){
            return res.status(400).json({
                error: "Missing customer_id",
                status:false
            })
        }
        const result= await (await appointment_historyModel.find({customer_id:customer_id}).populate("appointment_id")).shift("customer_id").populate("barber_id");
        if(result){
            res.json({
                message : "Fetched appointment history of Customer",
                result:result,
                statusCode:200
            })
        }else{
            res.json({
                message: "Could not fetched history",
                result:null,
                statusCode:404
            })
        }
    }
    catch(err){
        res.json({
            message: "Error",
            error:err.message
        })
    }
}

exports.getAppointmentHistoryOfBarber= async(req,res)=>{
    try{
        const  barber_id = req.query.barber_id;
        if( !barber_id ){
            return res.status(400).json({
                error: "Missing barber_id",
                status:false
            })
        }
        const result= await appointment_historyModel.find({barber_id:barber_id}).populate("appointment_id").populate("customer_id").populate("barber_id");
        if(result){
            res.json({
                message : "Fetched appointment history of barber",
                result:result,
                statusCode:200
            })
        }else{
            res.json({
                message: "Could not fetched history",
                result:null,
                statusCode:404
            })
        }
    }
    catch(err){
        res.json({
            message: "Error",
            error:err.message,
            status:false
        })
    }
}