const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/e_walletController');

router.get('./getUserWallet' , controller.getUserEwallet);

module.exports = router;