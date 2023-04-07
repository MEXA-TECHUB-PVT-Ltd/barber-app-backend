const express = require('express');

const router = express.Router();

const controller = require("../../controllers/USERS/adminController")

router.post("/register_admin" , controller.registerAdmin);
router.post("/login" , controller.login);


module.exports = router;