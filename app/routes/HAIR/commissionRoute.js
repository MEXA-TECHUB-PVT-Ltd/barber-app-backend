
const express = require("express"),
router=express.Router();

const controller= require("../../controllers/HAIR/commissionController");

router.post("/add_commission", controller.addCommission)
router.put("/update_status", controller.updateStatus)
router.get("/getAllCommissions", controller.getAllCommissions)
router.get("/getCommissionById", controller.getCommissionById)
router.delete("/deleteCommission", controller.deleteCommission)
router.put("/updateCommission", controller.updateCommission)




module.exports=router