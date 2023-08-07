const express = require('express')
const router = express.Router()

const authController = require('../../controllers/authController')

//logout
router.get('/', authController.handleLogout)

module.exports = router