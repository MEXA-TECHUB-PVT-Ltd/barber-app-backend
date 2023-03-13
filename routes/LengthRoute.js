const  express = require('express');
const router = express.Router();
const controller = require("../controllers/LengthController");


router.post('/create_length' , controller.createLenght);
router.get('/get_all_lengths' , controller.get_all_lengths);
router.get('/get_length' , controller.get_length);
router.put('/update_length' , controller.update_lenght);
router.delete('/delete_length' , controller.deleteLength);






module.exports = router;