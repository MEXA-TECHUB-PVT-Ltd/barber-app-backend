
const express = require('express');
const router = express.Router();
const controller = require("../controllers/appointmentHistoryController")


router.post("/createAppointmentHistory" , controller.createAppointmentHistory)
router.get("/getAllAppointmentHistories" , controller.getAllAppointmentHistories)
router.put("/updateAppointmentHistory", controller.updateAppointmentHistory)
router.delete("/deleteAppointmentHistory", controller.deleteAppointmentHistory)
router.get("/Barber_appointmentHistories" , controller.getAppointmentHistoryOfBarber);
router.get("/Customer_appointmentHistories" , controller.getAppointmentHistoryOfCustomer)

module.exports= router;