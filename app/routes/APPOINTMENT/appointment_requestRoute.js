const express = require('express');

const router = express.Router();

const controller = require("../../controllers/APPOINTMENT/appointment_requestController")

router.post("/create_request" , controller.create_request);
router.get("/request_by_id" , controller.getAppointmentRequestBy_id);
router.get("/barber_requests" , controller.viewAppointment_requestOfBarber);
router.put("/barber_accept_request" , controller.acceptRequestByBarber);
router.put("/barber_reject_request" , controller.rejectRequestByBarber);






module.exports = router;