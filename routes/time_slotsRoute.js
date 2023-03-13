const  express = require('express');
const router = express.Router();
const controller = require("../controllers/time_slotsController");


router.post('/add_time_slot' , controller.createTimeSlots);
router.get('/get_barber_time_slots' , controller.getBarberSlot);




module.exports = router;