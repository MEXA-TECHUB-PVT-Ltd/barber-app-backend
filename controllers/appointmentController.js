const mongoose = require('mongoose');

const userModel = require("../models/userModel")
const work_day_for_shopModel = require("../models/work_day_for_shopModel")
const work_day_for_shop_timingModel = require('../models/work_day_for_shop_timmingModel');
const create_notification_of_user = require('../utils/create_notification_of_user');
const store_send_notification = require("../utils/store_send_notification")

const appointment_model = require("../models/appointment_model");
const createNotificationOfUser = require('../utils/create_notification_of_user');
const createTransaction = require("../utils/createTransaction");
const hairStylePriceModel = require('../models/hairStylePriceModel');


exports.createAppointment = async (req, res) => {
    try {
        const customer_id = req.body.customer_id;
        const hair_style_id = req.body.hair_style_id;
        const barber_id = req.body.barber_id;
        const work_day_for_shop_id = req.body.work_day_for_shop_id;
        const work_day_for_shop_timing_id = req.body.work_day_for_shop_timing_id
        const appointment_date = req.body.appointment_date

        if (!customer_id || !hair_style_id || !barber_id || !work_day_for_shop_id || !work_day_for_shop_timing_id || !appointment_date) {
            return (
                res.json({
                    message: "customer_id , hair_style_id , barber_id , work_day_for_shop_id , work_day_for_shop_timing_id , appointment_date  , must be provided , It seems some attribute is missing ",
                    status: false
                })
            )
        }

        const customer = await userModel.findOne({ _id: customer_id, user_type: 'customer' });
        if (!customer) {
            return (
                res.json({
                    message: "It seems Customer with this id does not exists",
                    status: false
                })
            )
        }
        const barber = await userModel.findOne({ _id: barber_id, user_type: 'barber' });
        if (!barber) {
            return (
                res.json({
                    message: "It seems Barber with this id does not exists",
                    status: false
                })
            )
        }
        const is_work_day_for_shop = await work_day_for_shopModel.findOne({ _id: work_day_for_shop_id })
        if (!is_work_day_for_shop) {
            return (
                res.json({
                    message: "It seems work_day_for_shop with this id does not exists",
                    status: false
                })
            )
        }

        const is_work_day_for_shop_timing = await work_day_for_shop_timingModel.findOne({ _id: work_day_for_shop_timing_id })
        if (!is_work_day_for_shop_timing) {
            return (
                res.json({
                    message: "It seems work_day_for_shop_timing with this id does not exists",
                    status: false
                })
            )
        }

        //-------------------------------------------------------------------------------------------------------------

        const isSlotBooked = await checkAvailability(barber_id, appointment_date, work_day_for_shop_id, work_day_for_shop_timing_id)
        if (isSlotBooked) {
            return (
                res.json({
                    message: "It seems SlotBooked with this date",
                    status: false
                })
            )

        }

        const newAppointment = new appointment_model({
            _id: mongoose.Types.ObjectId(),
            customer_id: customer_id,
            barber_id: barber_id,
            hair_style_id: hair_style_id,
            work_day_for_shop_id: work_day_for_shop_id,
            work_day_for_shop_timing_id: work_day_for_shop_timing_id,
            appointment_date: appointment_date,
            pay_to_admin: {
                pay_to_admin: true,
            }
        })

        const result = await newAppointment.save();

        if (result) {
            res.json({
                message: "Appointment saved successfully",
                status: true,
                result: result
            })
        }
        else {
            res.json({
                message: "appointment could not be saved",
                status: false
            })
        }

    }
    catch (err) {
        res.json({
            message: "Error Occurred while creating appointment",
            status: false,
            error: err.message
        })
    }
}

exports.accept_reject_appointment = async (req, res) => {
    try {
        const appointment_id = req.body.appointment_id;
        const req_status = req.body.req_status;


        if (!appointment_id || !req_status) {
            return res.json({
                message: "appointment_id or req_status is missing",
                status: false
            })

        }

        if (req_status === "accepted" || req_status === "rejected") {

        }
        else {
            return res.json({
                message: "req_status can only be [accepted or rejected ]",
                status: false
            })

        }

        console.log(req_status)
        if (req_status == "accepted") {
            var result = await appointment_model.findOneAndUpdate({ _id: appointment_id , req_status:"requested" , status:'pending'}, { req_status: req_status, status: "scheduled" }, { new: true })
            if (result) {
                let to = result.customer_id
                var returnedObject = await store_send_notification(to, "Your appointment has been accepted by barber", "accept_appointment", 'barber');

            }
        }
        if (req_status == "rejected") {
            var result = await appointment_model.findOneAndUpdate({ _id: appointment_id }, { req_status: req_status, status: "cancelled" }, { new: true });
            if (result) {
                let to = result.customer_id
                var returnedObject = await store_send_notification(to, "Your appointment has been rejected by barber", "reject_appointment", 'barber');
            }
        }


        // consoling the result of store_send_notification
        if (returnedObject) {
            if (returnedObject.isSend == true) { console.log("Push notification send") } else { console.log("could not send push notification") }
            if (returnedObject.isCreateNotification == true) { console.log('notification created') }
            else { console.log("notification did not created") }
        }
        else { console.log("Notification Did not stored") }




        //sending response
        if (result) {
            res.json({
                message: "Appointment updated",
                status: true,
                result: result
            })
        }
        else {
            res.json({
                message: "appointment could not be updated , make sure that the appointment you are trying to complete must be in pending and requested state , otherwise you can not accept or reject",
                status: false
            })
        }


    } catch (error) {
        res.json({
            message: "Error Occurred",
            status: false,
            error: error.message
        })
    }
}

exports.changeBarber = async (req, res) => {
    try {
        const appointment_id = req.body.appointment_id;
        const barber_id = req.body.barber_id;


        const barber = await userModel.findOne({ _id: barber_id, user_type: 'barber' });
        if (!barber) {
            return (
                res.json({
                    message: "It seems Barber with this id does not exists",
                    status: false
                })
            )
        }


        if (!appointment_id || !barber_id) {
            return (
                res.json({
                    message: "appointment_id or barber_id is missing",
                    status: false
                })
            )
        }

        const foundAppointment = await appointment_model.findOne({ _id: appointment_id });
        if (foundAppointment) {
            let status = foundAppointment.status;
            let req_status = foundAppointment.req_status;

            if (status === "scheduled" && req_status === "accepted") {
                return (
                    res.json({
                        message: "This appointment is already scheduled , You cant change the barber",
                        status: false
                    })
                )
            }

            const result = await appointment_model.findOneAndUpdate({ _id: appointment_id }, { barber_id: barber_id, status: "pending", req_status: "requested" }, { new: true });

            if (result) {
                res.json({
                    message: "Appointment updated successfully , Barber changed",
                    status: true,
                    result: result
                })
            }
            else {
                res.json({
                    message: "Could not change barber",
                    status: true,
                })
            }
        }

    }
    catch (err) {
        res.json({
            message: "Error Occurred ",
            status: false,
            error: err.message
        })
    }
}

exports.barberAppointments = async (req, res) => {
    try {
        const barber_id = req.query.barber_id;

        const barber = await userModel.findOne({ _id: barber_id, user_type: 'barber' });
        if (!barber) {
            return (
                res.json({
                    message: "It seems Barber with this id does not exists",
                    status: false
                })
            )
        }

        const result = await appointment_model.find({ barber_id: barber_id }).populate("barber_id").populate("customer_id").populate("hair_style_id");
        if (result) {
            res.json({
                message: "Result",
                status: true,
                result: result
            })
        }
        else {
            res.json({
                message: "Could not get result",
                status: true,
            })
        }

    }
    catch (err) {
        res.json({
            message: "Error Occurred while ",
            status: false,
            error: err.message
        })
    }
}

exports.BarberScheduledAppointments = async (req, res) => {
    try {
        const barber_id = req.query.barber_id;

        const barber = await userModel.findOne({ _id: barber_id, user_type: 'barber' });
        if (!barber) {
            return (
                res.json({
                    message: "It seems Barber with this id does not exists",
                    status: false
                })
            )
        }

        const result = await appointment_model.find({ barber_id: barber_id, status: "scheduled", req_status: "accepted" }).populate("barber_id").populate("customer_id").populate("hair_style_id");
        if (result) {
            res.json({
                message: "Result",
                status: true,
                result: result
            })
        }
        else {
            res.json({
                message: "Could not get result",
                status: true,
            })
        }

    }
    catch (err) {
        res.json({
            message: "Error Occurred while creating appointment",
            status: false,
            error: err.message
        })
    }

}

exports.BarberCompletedAppointments = async (req, res) => {
    try {
        const barber_id = req.query.barber_id;

        const barber = await userModel.findOne({ _id: barber_id, user_type: 'barber' });
        if (!barber) {
            return (
                res.json({
                    message: "It seems Barber with this id does not exists",
                    status: false
                })
            )
        }

        const result = await appointment_model.find({ barber_id: barber_id, status: "completed", req_status: "accepted" }).populate("barber_id").populate("customer_id").populate("hair_style_id");
        if (result) {
            res.json({
                message: "Result",
                status: true,
                result: result
            })
        }
        else {
            res.json({
                message: "Could not get result",
                status: true,
            })
        }

    }
    catch (err) {
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }

}

exports.completeAppointment = async (req, res) => {
    try {
        const appointment_id = req.body.appointment_id;
        let imagesArray = [];

        if(!req.files){
            return (
                res.json({
                    message: "please provide images in image field , atleast one and atmost 3 images",
                    status: false
                })
            )
        }

        if(req.files.length ==0){
            return (
                res.json({
                    message: "You must provide atleast one image for completion of appointment",
                    status: false
                })
            )
        }

        if(req.files){
            if(req.files.length > 3){
                return (
                    res.json({
                        message: "Images cannot be more than 3 .",
                        status: false
                    })
                )
            }

            req.files.forEach(element => {
                if(element){
                    imagesArray.push(element.path)
                }
            });
        }
        
        if (!appointment_id) {
            return (
                res.json({
                    message: "Please provide appointment id",
                    status: false
                })
            )
        }



        const result = await appointment_model.findOneAndUpdate({ _id: appointment_id, status: "scheduled", req_status: "accepted" }, { status: "completed" , completion_images: imagesArray }, { new: true });
        if (result) {
            let to = result.customer_id
            var returnedObject = await store_send_notification(to, "Your appointment has been completed", "completes_appointment", 'barber');
        };

        // for sending notification
        if (returnedObject) {
            if (returnedObject.isSend == true) { console.log("Push notification send") } else { console.log("could not send push notification") }
            if (returnedObject.isCreateNotification == true) { console.log('notification created') }
            else { console.log("notification did not created") }
        }
        else { console.log("Notification Did not stored") }



        
        if(result){
            let hairStylePrice = await getHairStylePrice();
            const isCreatedTransaction = await createTransaction({
                type: 'debit' , 
                amount: hairStylePrice,
                appointment_id: appointment_id,
                from : ''
                


            })
        }

        if (result) {
            res.json({
                message: "status changed to completed",
                result: result,
                status: true
            })
        }
        else {
            res.json({
                message: "Could not change , Make sure appointment with this id exists & current status of appointment is scheduled by accepting it. Because you cannot complete the appointment without accepting it. ",
                result: result,
                status: false
            })
        }


    }
    catch (err) {
        res.json({
            message: "Error Occurred while ",
            status: false,
            error: err.message
        })
    }
}

exports.cancelAppointment = async (req, res) => {
    try {
        const appointment_id = req.query.appointment_id;
        const cancelled_by = req.query.cancelled_by;
        const cancelling_reason = req.query.cancelling_reason;

    

        if (!appointment_id || !cancelled_by) {
            return (
                res.json({
                    message: "Please provide appointment id and cancelled_by both",
                    status: false
                })
            )
        }

        if(cancelled_by == 'barber' || cancelled_by=='customer'){
        }
        else{
            return (
                res.json({
                    message: "cancelled by must be only baber or customer",
                    status: false
                })
            )
        }
        
        if(cancelled_by=='barber'){
            var result = await appointment_model.findOneAndUpdate({ _id: appointment_id }, { status: "cancelled" , cancelled_by:'barber' , cancelling_reason: cancelling_reason}, { new: true });
        }
        if(cancelled_by=='customer'){
            var result = await appointment_model.findOneAndUpdate({ _id: appointment_id }, { status: "cancelled" , cancelled_by:'customer' , cancelling_reason: cancelling_reason}, { new: true });
        }



        if (result) {
            let to;
            if(cancelled_by == 'barber'){
                 to = result.customer_id;
                 var returnedObject = await store_send_notification(to, "This appointment has been cancelled by barber", "cancels_appointment", 'barber');

            }
            if(cancelled_by == 'customer'){
                to = result.barber_id;
                var returnedObject = await store_send_notification(to, "This appointment has been cancelled by customer", "cancels_appointment", 'customer');

            }
           
            // consoling the result of store_send_notification
            if (returnedObject) {
                if (returnedObject.isSend == true) { console.log("Push notification send") } else { console.log("could not send push notification nof cancelling push notification") }
                if (returnedObject.isCreateNotification == true) { console.log('notification created') }
                else { console.log("notification did not created") }
            }
            else { console.log("Notification Did not stored") }
        }



        if (result) {
            res.json({
                message: "status changed to cancelled",
                result: result,
                status: true
            })
        }
        else {
            res.json({
                message: "Could not change , Make sure appointment with this id exists. ",
                result: result,
                status: false
            })
        }


    }
    catch (err) {
        res.json({
            message: "Error Occurred while ",
            status: false,
            error: err.message
        })
    }
}

exports.deleteAppointment = async (req, res) => {
    try {
        const appointment_id = req.query.appointment_id;

        if (!appointment_id) {
            return (
                res.json({
                    message: "Please provide appointment id",
                    status: false
                })
            )
        }

        const result = await appointment_model.deleteOne({ _id: appointment_id });
        if (result.deletedCount > 0) {
            res.json({
                message: "appointment deleted permanently",
                result: result,
                status: true
            })
        }
        else {
            res.json({
                message: "Could not delete appointment",
                result: result,
                status: false
            })
        }


    }
    catch (err) {
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
}

exports.customerAppointments = async (req, res) => {
    try {
        const customer_id = req.query.customer_id;

        const customer = await userModel.findOne({ _id: customer_id, user_type: 'customer' });
        if (!customer) {
            return (
                res.json({
                    message: "It seems customer with this id does not exists",
                    status: false
                })
            )
        }

        const result = await appointment_model.find({ customer_id: customer_id }).populate("barber_id").populate("customer_id").populate("hair_style_id");
        if (result) {
            res.json({
                message: "Result",
                status: true,
                result: result
            })
        }
        else {
            res.json({
                message: "Could not get result",
                status: true,
            })
        }

    }
    catch (err) {
        res.json({
            message: "Error Occurred while ",
            status: false,
            error: err.message
        })
    }
}

exports.customerScheduledAppointments = async (req, res) => {
    try {
        const customer_id = req.query.customer_id;

        const customer = await userModel.findOne({ _id: customer_id, user_type: 'customer' });
        if (!customer) {
            return (
                res.json({
                    message: "It seems customer with this id does not exists",
                    status: false
                })
            )
        }

        const result = await appointment_model.find({ customer_id: customer_id, status: "scheduled", req_status: "accepted" }).populate("barber_id").populate("customer_id").populate("hair_style_id");
        if (result) {
            res.json({
                message: "Result",
                status: true,
                result: result
            })
        }
        else {
            res.json({
                message: "Could not get result",
                status: true,
            })
        }

    }
    catch (err) {
        res.json({
            message: "Error Occurred while ",
            status: false,
            error: err.message
        })
    }
}

exports.customerCompletedAppointments = async (req, res) => {
    try {
        const customer_id = req.query.customer_id;

        const customer = await userModel.findOne({ _id: customer_id, user_type: 'customer' });
        if (!customer) {
            return (
                res.json({
                    message: "It seems customer with this id does not exists",
                    status: false
                })
            )
        }

        const result = await appointment_model.find({ customer_id: customer_id, status: "completed", req_status: "accepted" }).populate("barber_id").populate("customer_id").populate("hair_style_id");
        if (result) {
            res.json({
                message: "Result",
                status: true,
                result: result
            })
        }
        else {
            res.json({
                message: "Could not get result",
                status: true,
            })
        }

    }
    catch (err) {
        res.json({
            message: "Error Occurred while ",
            status: false,
            error: err.message
        })
    }
}

exports.getAppointmentById = async(req,res)=>{
    try{
        const appointment_id = req.query.appointment_id;
        const reuslt = await appointment_model.findOne({_id:appointment_id});

        if(reuslt){
            res.json({
                message: "Appointement by id fetched",
                status:true,
                result:reuslt
            })
        }
        else{
            res.json({
                message: "Could not fetch appointment",
                status:false,
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

async function checkAvailability(barber_id, appointment_date, work_day_for_shop_id, work_day_for_shop_timing_id) {
    try {
        const foundResult = await appointment_model.findOne({
            barber_id: barber_id, appointment_date: appointment_date, work_day_for_shop_id: work_day_for_shop_id, work_day_for_shop_timing_id: work_day_for_shop_timing_id, status: "scheduled", req_status: "accepted"
        });
        if (foundResult) {
            return true;
        }
        else {
            return false;

        }

    }
    catch (err) {
        return false;
        console.log(err)
    }
}

async function getHairStylePrice (){
    try{
        const result = await hairStylePriceModel.findOne({unique_id: 'HS_unique'});
        if(result){
            if(result.price){
                return result.price
            }
        }
        else{
            return false
        }
    }
    catch(err){
        console.log(err);
        return false
    }
}