const express = require('express');
const router = express.Router();
const stucontController = require('../controllers/stuContController');



router.post('/uploadgrades', stucontController.createNewStudent);




module.exports = router
