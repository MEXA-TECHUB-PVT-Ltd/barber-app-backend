const  express = require('express');
const router = express.Router();
const controller = require("../../controllers/TIME_SLOTS/slot_timmingsController");


router.post('/add_time_slot' , controller.createTimeSlots);
router.get('/get_barber_time_slots' , controller.getBarberSlot);
router.delete('/deleteTimeSlot' , controller.deleteTimeSlots);





module.exports = router;