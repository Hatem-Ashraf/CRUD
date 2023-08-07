const express = require('express')
const router = express.Router()
const ROLES_LIST = require('../../config/roles_list')
const verifyRoles = require('../../middleware/verifyRoles')

const oneStuController = require('../../controllers/oneStudentController')

router.route("/:id")
    .get(oneStuController.getOneStudent)

module.exports = router
