const express = require('express');

const router = express.Router();

const controller = require("../controllers/BarberController")

router.post("/register_Barber" , controller.registerBarber);
router.post("/login" , controller.login);
router.put("/update_profile" , controller.updateProfile);



module.exports = router;