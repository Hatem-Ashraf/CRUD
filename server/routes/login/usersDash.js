const express = require("express")
const router = express.Router()
const verifyRoles = require('../../middleware/verifyRoles')
const ROLES_LIST = require('../../config/roles_list')

const authController = require('../../controllers/authController')

router.route('/editor')
    .get(verifyRoles(ROLES_LIST.Editor), authController.editorDashboard)

router.route('/control')
    .get(verifyRoles(ROLES_LIST.Admin), authController.controlDashboard)



module.exports = router