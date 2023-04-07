const express = require('express');

const router = express.Router();

const controller = require("../../controllers/USERS/customerController")

router.post("/register_customer" , controller.registerCustomer);
router.post("/login" , controller.login);
router.put("/update_profile" , controller.updateProfile);



module.exports = router;