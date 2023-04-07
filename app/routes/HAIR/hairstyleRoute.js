const express = require('express');

const router = express.Router();

const controller = require("../../controllers/HAIR/hairStyleController")

router.post("/createHairStyle" , controller.createHairStyle);
router.get("/getAllHairStyles" , controller.getAllHairStyles);
router.get("/getHairStyle" , controller.getHairStyle);
router.put("/updateHairStyle" , controller.updateHairStyle);
router.delete("/deleteHairStyle" , controller.deleteHairStyle);


module.exports = router;