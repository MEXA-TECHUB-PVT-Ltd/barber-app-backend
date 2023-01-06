const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const controller = require("../controllers/appointmentController")

router.post("/create_appointment", controller.createAppointment);
router.put("/accept_reject_appointment", controller.accept_reject_appointment);
router.put("/change_barber", controller.changeBarber);
router.get("/barber_appointments", controller.barberAppointments);
router.get("/barber_Scheduled_appointments", controller.BarberScheduledAppointments);
router.get("/barber_completed_appointments", controller.BarberCompletedAppointments);
router.put("/completeAppointment", controller.completeAppointment);
router.put("/cancelAppointment", controller.cancelAppointment);
router.delete("/deleteAppointment", controller.deleteAppointment);
router.get("/customerAppointments", controller.customerAppointments);
router.get("/customerScheduledAppointments", controller.customerScheduledAppointments);
router.get("/customerCompletedAppointments", controller.customerCompletedAppointments);








module.exports =router;
