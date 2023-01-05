
const express = require('express');
const router = express.Router();
const controller = require("../controllers/work_day_for_shopController")
const auth = require("../middlewares/auth")

router.post("/createWorkDay" , controller.createWorkDayForShop)
router.get("/getAllWOrkDays" , controller.getAllWorkDays)
router.get("/getWorkDayById" , controller.getWorkDayById)
router.delete("/deleteWorkDay", controller.deleteWorkDay)
router.put("/updateWorkDay", controller.updateWorkDay)
router.get("/getWorkDaysOfBarber", controller.getWorkDaysByBarber_id)
router.get("/getWorkDaysWithTiming", controller.getWorkDaysWithTiming)
// router.get("/getWorkDaysWithTimingAndTypeOfWork", controller.getWorkDaysWithTimingAndTypeOfWork)



module.exports= router;