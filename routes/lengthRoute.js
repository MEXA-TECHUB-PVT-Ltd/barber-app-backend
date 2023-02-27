const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const controller = require("../controllers/lengthController");

router.post("/add_length" , controller.add_length);
router.get("/getAll" , controller.getAllLength);
router.get("/getLength" , controller.getLength);
router.delete("/deleteLength" , controller.deleteLength);
router.put("/update_length" , controller.updateLength);


module.exports = router
