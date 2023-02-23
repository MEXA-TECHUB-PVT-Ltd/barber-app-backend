const express = require('express');
const router = express.Router();
const controller = require("../controllers/work_day_for_shop_timingController")


router.post("/createWorkDayForShopTiming" , controller.createWorkDayForShopTiming)
router.get("/getAllWOrkDaysForShopTiming" , controller.getAllShopsTimings)
router.get("/getWorkDayShopTimingById" , controller.getAllShopsTimingsById)
router.delete("/deleteWorkDayShopTiming", controller.deleteWorkDayForShopTiming)
// router.put("/updateWorkDayForShopTiming", controller.updateWorkDayForShopTiming)

module.exports= router;