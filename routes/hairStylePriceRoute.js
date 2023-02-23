
const express = require('express');
const router = express.Router();
const controller = require("../controllers/productPriceController")

router.post("/createHairStylePrice" , controller.createHairStylePrice)
router.get("/getHairStylePrice" , controller.getHairStylePrice)
router.put("/updateHairStylePrice" , controller.updateHairStylePriceByUnique_id)




module.exports= router;