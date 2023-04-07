const  express = require('express');
const router = express.Router();
const controller = require("../../controllers/HAIR/hairCutPriceController");


router.post('/setPrice' , controller.setPrice);
router.put('/updatePrice' , controller.updatePrice);

module.exports = router;