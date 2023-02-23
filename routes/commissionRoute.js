
const express = require("express"),
router=express.Router();

const controller= require("../controllers/commissionController");

router.post("/add_commission", controller.addCommission)
router.put("/update_status", controller.updateStatus)
router.get("/getAllCommissions", controller.getAllCommissions)
router.get("/getCommissionById", controller.getCommissionById)
router.get("/active_commission", controller.getActiveCommission)



module.exports=router