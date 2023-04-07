const express = require('express');

const router = express.Router();

const controller = require("../../controllers/APPOINTMENT/appointmentController")

router.post("/createAppointment" , controller.createAppointment);

// router.get("/getAll_barberAppointments" , controller.getAll_barberAppointments);
// router.put("/accept_reject" , controller.accept_reject);
// router.put("/completeAppointment" , controller.completeAppointment);
// router.put("/scheduleAppointment" , controller.scheduleAppointment);
// router.put("/changeAppointmentStatus" , controller.changeAppointmentStatus);
// router.get("/barberUpCommingAppointments" , controller.barberUpCommingAppointments);
// router.put("/cancelAppointment" , controller.cancelAppointment);


module.exports = router;