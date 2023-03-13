const  express = require('express');
const router = express.Router();
const controller = require("../controllers/slot_daysController");


router.post('/add_slot_day' , controller.create_slot_day);
router.get('/getBarberDaysAndSlots' , controller.getBarberDaysAndtimeSlots);





module.exports = router;