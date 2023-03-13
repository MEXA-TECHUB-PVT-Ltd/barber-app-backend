
const  express = require('express');

const router = express.Router();
const controller = require("../controllers/upload_imageAPI")
const auth =require('../middlewares/auth')


router.post('/upload' ,auth  ,controller.uploadImage);

module.exports= router