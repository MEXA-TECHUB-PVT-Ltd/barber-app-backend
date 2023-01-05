

const express = require('express');
const router = express.Router();
const controller = require("../controllers/barber_RatingController")


router.post("/rateBarber" , controller.rateBarber )
router.get("/getAllBarbersRatings", controller.getBarberRating)
router.get("/getBarberRatingById", controller.getBarberRatingById)

router.get("/getTotalBarberRating/:barber_id" , controller.getTotalBarberRating)
router.delete("/deleteBarberRating/:barberRatingId" , controller.deleteBarberRating)


module.exports= router;