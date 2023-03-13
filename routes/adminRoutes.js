const express = require('express');

const router = express.Router();

const controller = require("../controllers/AdminController")

router.post("/register_admin" , controller.registerAdmin);
router.post("/login" , controller.login);


module.exports = router;