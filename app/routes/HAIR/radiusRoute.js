const  express = require('express');
const router = express.Router();
const controller = require("../../controllers/HAIR/radiusController");


router.post('/create_radius' , controller.createRadius);
router.put('/update_radius' , controller.updateRadius);



module.exports = router;