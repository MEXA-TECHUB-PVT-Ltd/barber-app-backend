const express = require("express"),
router=express.Router();

const controller= require("../controllers/hairStyleController");
const upload = require("../middlewares/adminImgMulter")
router.post("/add_hairStyle", upload.single("image"),controller.addHairStyle)
router.get("/getAll_hairStyle",controller.getAllHairStyles)
router.get("/get_hairStyleById",controller.getHairStyleById)
router.delete("/deleteHairStyle",controller.deleteHairStyle)
router.put("/updateHairStylePrice",controller.updateHairStylePrice)
router.get("/search_hair_styles",controller.search_hair_styles)
router.put("/updateHairStyle" ,upload.single("image"),controller.updateHairStyle)








module.exports=router