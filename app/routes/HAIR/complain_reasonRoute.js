const express = require("express"),
router=express.Router();
const controller= require("../../controllers/HAIR/complain_reasonController");


router.post("/add_reason" ,controller.addReason)
router.put("/update_reason" ,controller.updateReason)
router.delete("/delete_reason" ,controller.deleteReason)
router.get("/getAllReasons" ,controller.getAllReasons)
router.get("/getReasonById" ,controller.getReasonById)




module.exports=router