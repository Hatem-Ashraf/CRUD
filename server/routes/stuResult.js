const express = require('express')
const router = express.Router()

const stuResultController = require('../controllers/stuResultController')

//Student scores routes

router.route("/get/:id")
    .get(stuResultController.getOneStudent)

router.route("/create/:id")
    .get(stuResultController.createOneStudent)

router.route("/update/:id")
    .get(stuResultController.updateStudent)

// .delete(stuResultController.deleteStudent)

module.exports = router