
const express = require('express');
const router = express.Router();
const controller = require("../controllers/userController")
const auth = require("../middlewares/auth")
const upload = require("../middlewares/userPicsMulter")

router.post("/register/" , upload.single("photo"), controller.register)
router.post("/login" , controller.login)
router.post("/checkLogin",auth ,controller.checkLogin)
router.get("/getAllUsers" , controller.getAllUsers)
router.get("/getSpecificUser/:user_id" , controller.getSpecificUser)
router.delete("/deleteUser/:user_id" , controller.deleteUser)
router.put("/updateUser", upload.single("photo"), controller.updateUser)
router.put("/updatePassword" , controller.updatePassword)
router.get("/getAllDeviceTokens" , controller.getAllDeviceTokens)
router.put("/change_blockStatus" , controller.change_blockStatus)
router.put("/update_userLocation" , controller.updateUserLocation)
router.get("/getBarbersWithinRadius" , controller.getBarbersInRadius)
router.get("/searchBarber" , controller.searchBarber)
router.get("/view_block_barbers" , controller.view_block_barbers)








module.exports= router;