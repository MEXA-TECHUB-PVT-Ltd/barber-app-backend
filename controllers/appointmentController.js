const mongoose = require('mongoose');

const userModel = require("../models/userModel")
const work_day_for_shopModel = require("../models/work_day_for_shopModel")
const work_day_for_shop_timingModel = require('../models/work_day_for_shop_timmingModel')

const appointment_model = require("../models/appointment_model")
exports.createAppointment = async (req,res)=>{
    try{
        const customer_id = req.body.customer_id;
        const hair_style_id = req.body.hair_style_id;
        const barber_id = req.body.barber_id;
        const work_day_for_shop_id = req.body.work_day_for_shop_id;
        const work_day_for_shop_timing_id = req.body.work_day_for_shop_timing_id
        const appointment_date = req.body.appointment_date

        if(!customer_id || !hair_style_id || !barber_id || !work_day_for_shop_id || !work_day_for_shop_timing_id || !appointment_date ){
            return (
                res.json({
                    message: "customer_id , hair_style_id , barber_id , work_day_for_shop_id , work_day_for_shop_timing_id , appointment_date  , must be provided , It seems some attribute is missing ",
                    status:false
                })
            )
        }

        const customer = await userModel.findOne({_id: customer_id , user_type: 'customer'});
        if(!customer){
            return (
                res.json({
                     message: "It seems Customer with this id does not exists",
                    status:false
                })
            )
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
      const is_work_day_for_shop= await work_day_for_shopModel.findOne({_id:work_day_for_shop_id})
      if(!is_work_day_for_shop){
        return (
            res.json({
                 message: "It seems work_day_for_shop with this id does not exists",
                status:false
            })
        )
      }

      const is_work_day_for_shop_timing= await work_day_for_shop_timingModel.findOne({_id:work_day_for_shop_timing_id})
      if(!is_work_day_for_shop_timing){
        return (
            res.json({
                 message: "It seems work_day_for_shop_timing with this id does not exists",
                status:false
            })
        )
      }

      //-------------------------------------------------------------------------------------------------------------

      const isSlotBooked = await checkAvailability(barber_id , appointment_date , work_day_for_shop_id , work_day_for_shop_timing_id)
      if(isSlotBooked){
        return (
            res.json({
                 message: "It seems SlotBooked with this date",
                status:false
            })
        )

      }

      const newAppointment = new appointment_model({
        _id:mongoose.Types.ObjectId(),
        customer_id:customer_id,
        barber_id:barber_id,
        hair_style_id:hair_style_id,
        work_day_for_shop_id:work_day_for_shop_id,
        work_day_for_shop_timing_id:work_day_for_shop_timing_id,
        appointment_date:appointment_date,
      })

      const result = await newAppointment.save();

      if(result){
        res.json({
            message : "Appointment saved successfully",
            status:true,
            result:result
        })
      }
      else{
        res.json({
            message: "appointment could not be saved",
            status:false
        })
      }

}
catch(err){
    res.json({
        message: "Error Occurred while creating appointment",
        status:false,
        error:err.message
    })
}
}

exports.accept_reject_appointment = async(req,res)=>{
    try {
        const appointment_id = req.body.appointment_id;
        const req_status = req.body.req_status;     
        
        
        if(!appointment_id ||!req_status){
            return res.json({
                            message: "appointment_id or req_status is missing",
                            status:false
                        })
            
        }

        if(req_status ==="accepted" || req_status ==="rejected"){

        }
        else{
            return res.json({
                            message: "req_status can only be [accepted or rejected ]",
                            status:false
                        })
            
        }

        console.log(req_status)
        if(req_status== "accepted"){
            var result =await  appointment_model.findOneAndUpdate({_id:appointment_id} , {req_status:req_status , status:"scheduled"} ,{new:true})
        }
        if(req_status== "rejected"){
            var result = await appointment_model.findOneAndUpdate({_id:appointment_id} , {req_status:req_status , status:"cancelled"} , {new:true})
        }
        console.log(result)

        if(result){
            res.json({
                message : "Appointment updated",
                status:true,
                result:result
            })
          }
          else{
            res.json({
                message: "appointment could not be updated",
                status:false
            })
          }
        

    } catch (error) {
        res.json({
            message:"Error Occurred",
            status:false,
            error:error.message
        })
    }
}


exports.changeBarber  = async (req,res)=>{
    try{
        const appointment_id = req.body.appointment_id ; 
        const barber_id = req.body.barber_id ;


    const barber = await userModel.findOne({_id: barber_id , user_type: 'barber'});
       if(!barber){
        return (
            res.json({
                 message: "It seems Barber with this id does not exists",
                status:false
            })
        )
      }


        if(!appointment_id ||!barber_id){
            return(
                res.json({
                    message: "appointment_id or barber_id is missing",
                    status:false
                })
            )
        }

        const foundAppointment =await appointment_model.findOne({_id:appointment_id});
        if(foundAppointment){
            let status = foundAppointment.status;
            let req_status= foundAppointment.req_status;

            if(status ==="scheduled" && req_status === "accepted"){
                return (
                    res.json({
                        message : "This appointment is already scheduled , You cant change the barber",
                        status:false
                    })
                )
            }

            const result = await appointment_model.findOneAndUpdate({_id: appointment_id} , {barber_id: barber_id , status:"pending" , req_status:"requested"} , {new:true});

            if(result){
                res.json({
                    message: "Appointment updated successfully , Barber changed",
                    status:true,
                    result:result
                })
            }
            else{
                res.json({
                    message: "Could not change barber",
                    status:true,
                })
            }
        }

    }
    catch(err){
        res.json({
            message: "Error Occurred ",
            status:false,
            error:err.message
        })
    }
}

exports.barberAppointments = async (req,res)=>{
    try{
        const barber_id = req.query.barber_id;

       const barber = await userModel.findOne({_id: barber_id , user_type: 'barber'});
       if(!barber){
        return (
            res.json({
                 message: "It seems Barber with this id does not exists",
                status:false
            })
        )
      }

      const result = await appointment_model.find({barber_id:barber_id}).populate("barber_id").populate("customer_id").populate("hair_style_id");
      if(result){
        res.json({
            message: "Result",
            status:true,
            result:result
        })
    }
    else{
        res.json({
            message: "Could not get result",
            status:true,
        })
    }

    }
    catch(err){
        res.json({
            message: "Error Occurred while ",
            status:false,
            error:err.message
        })
    }
}

exports.BarberScheduledAppointments = async(req,res)=>{
    try{
        const barber_id = req.query.barber_id;

       const barber = await userModel.findOne({_id: barber_id , user_type: 'barber'});
       if(!barber){
        return (
            res.json({
                 message: "It seems Barber with this id does not exists",
                status:false
            })
        )
      }

      const result = await appointment_model.find({barber_id:barber_id , status:"scheduled" , req_status:"accepted"}).populate("barber_id").populate("customer_id").populate("hair_style_id");
      if(result){
        res.json({
            message: "Result",
            status:true,
            result:result
        })
    }
    else{
        res.json({
            message: "Could not get result",
            status:true,
        })
    }

    }
    catch(err){
        res.json({
            message: "Error Occurred while creating appointment",
            status:false,
            error:err.message
        })
    }

}

exports.BarberCompletedAppointments = async(req,res)=>{
    try{
        const barber_id = req.query.barber_id;

       const barber = await userModel.findOne({_id: barber_id , user_type: 'barber'});
       if(!barber){
        return (
            res.json({
                 message: "It seems Barber with this id does not exists",
                status:false
            })
        )
      }

      const result = await appointment_model.find({barber_id:barber_id , status:"completed" , req_status:"accepted"}).populate("barber_id").populate("customer_id").populate("hair_style_id");
      if(result){
        res.json({
            message: "Result",
            status:true,
            result:result
        })
    }
    else{
        res.json({
            message: "Could not get result",
            status:true,
        })
    }

    }
    catch(err){
        res.json({
            message: "Error Occurred",
            status:false,
            error:err.message
        })
    }

}

exports.completeAppointment = async (req,res)=>{
    try{
        const appointment_id = req.query.appointment_id;

        if(!appointment_id){
            return (
                res.json({
                     message: "Please provide appointment id",
                    status:false
                })
            )
        }

        const result = await appointment_model.findOneAndUpdate({_id:appointment_id , status:"scheduled" , req_status:"accepted"} , {status:"completed"} , {new:true});
        if(result){
            res.json({
                message: "status changed to completed",
                result: result,
                status:true
            })
        }
        else{
            res.json({
                message: "Could not change , Make sure appointment with this id exists & current status of appointment is scheduled by accepting it. Because you cannot complete the appointment without accepting it. ",
                result: result,
                status:false
            })
        }

        
    }
    catch(err){
        res.json({
            message: "Error Occurred while ",
            status:false,
            error:err.message
        })
    }
}

exports.cancelAppointment = async (req,res)=>{
    try{
        const appointment_id = req.query.appointment_id;

        if(!appointment_id){
            return (
                res.json({
                     message: "Please provide appointment id",
                    status:false
                })
            )
        }

        const result = await appointment_model.findOneAndUpdate({_id:appointment_id} , {status:"cancelled"} , {new:true});
        if(result){
            res.json({
                message: "status changed to cancelled",
                result: result,
                status:true
            })
        }
        else{
            res.json({
                message: "Could not change , Make sure appointment with this id exists. ",
                result: result,
                status:false
            })
        }

        
    }
    catch(err){
        res.json({
            message: "Error Occurred while ",
            status:false,
            error:err.message
        })
    }
}

exports.deleteAppointment = async (req,res)=>{
    try{
        const appointment_id = req.query.appointment_id;

        if(!appointment_id){
            return (
                res.json({
                     message: "Please provide appointment id",
                    status:false
                })
            )
        }

        const result = await appointment_model.deleteOne({_id:appointment_id});
        if(result.deletedCount>0){
            res.json({
                message: "appointment deleted permanently",
                result: result,
                status:true
            })
        }
        else{
            res.json({
                message: "Could not delete appointment",
                result: result,
                status:false
            })
        }

        
    }
    catch(err){
        res.json({
            message: "Error Occurred",
            status:false,
            error:err.message
        })
    }
}

exports.customerAppointments = async (req,res)=>{
    try{
        const customer_id = req.query.customer_id;

       const customer = await userModel.findOne({_id: customer_id , user_type: 'customer'});
       if(!customer){
        return (
            res.json({
                 message: "It seems customer with this id does not exists",
                status:false
            })
        )
      }

      const result = await appointment_model.find({customer_id:customer_id}).populate("barber_id").populate("customer_id").populate("hair_style_id");
      if(result){
        res.json({
            message: "Result",
            status:true,
            result:result
        })
    }
    else{
        res.json({
            message: "Could not get result",
            status:true,
        })
    }

    }
    catch(err){
        res.json({
            message: "Error Occurred while ",
            status:false,
            error:err.message
        })
    }
}
exports.customerScheduledAppointments = async (req,res)=>{
    try{
        const customer_id = req.query.customer_id;

       const customer = await userModel.findOne({_id: customer_id , user_type: 'customer'});
       if(!customer){
        return (
            res.json({
                 message: "It seems customer with this id does not exists",
                status:false
            })
        )
      }

      const result = await appointment_model.find({customer_id:customer_id , status:"scheduled" , req_status:"accepted"}).populate("barber_id").populate("customer_id").populate("hair_style_id");
      if(result){
        res.json({
            message: "Result",
            status:true,
            result:result
        })
    }
    else{
        res.json({
            message: "Could not get result",
            status:true,
        })
    }

    }
    catch(err){
        res.json({
            message: "Error Occurred while ",
            status:false,
            error:err.message
        })
    }
}

exports.customerCompletedAppointments = async (req,res)=>{
    try{
        const customer_id = req.query.customer_id;

       const customer = await userModel.findOne({_id: customer_id , user_type: 'customer'});
       if(!customer){
        return (
            res.json({
                 message: "It seems customer with this id does not exists",
                status:false
            })
        )
      }

      const result = await appointment_model.find({customer_id:customer_id ,status:"completed" , req_status:"accepted"}).populate("barber_id").populate("customer_id").populate("hair_style_id");
      if(result){
        res.json({
            message: "Result",
            status:true,
            result:result
        })
    }
    else{
        res.json({
            message: "Could not get result",
            status:true,
        })
    }

    }
    catch(err){
        res.json({
            message: "Error Occurred while ",
            status:false,
            error:err.message
        })
    }
}



async function checkAvailability(barber_id , appointment_date , work_day_for_shop_id , work_day_for_shop_timing_id){
    try{
        const foundResult = await appointment_model.findOne({barber_id:barber_id, appointment_date:appointment_date , work_day_for_shop_id:work_day_for_shop_id , work_day_for_shop_timing_id:work_day_for_shop_timing_id , status:"scheduled" , req_status:"accepted" 
    });
    if(foundResult){
        return true;
    }
    else{
        return false;

    }
    
    }
    catch(err){
        return false;
        console.log(err)
    }
}