const express = require("express")
const router = express.Router()

const verifyRoles = require('../../middleware/verifyRoles')
const ROLES_LIST = require('../../config/roles_list')

const authController = require('../../controllers/authController')


//login as editor
router.route('/editor')
    .post(authController.editorLogin)
    
//login as control
router.route('/control')
    .post(authController.controlLogin)

////login as student
router.route('/student')
    .post(authController.studentLogin)
module.exports = router