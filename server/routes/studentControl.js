const express = require('express');
const router = express.Router();
const stucontController = require('../controllers/stuContController');
router.post('/uploadgrades', stucontController.createNewStudent);
router.get('/update/:id', stucontController.update);


router.route('/')
    // .get(stucontController.getAllStudents)
    .post(stucontController.createNewStudent)

router.route("/update/:id")
    // .get(stucontController.getOneStudent)
    .put(stucontController.update)
    // .delete(stucontController.deleteStudent)

module.exports = router
