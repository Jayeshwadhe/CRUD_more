const express = require('express')
const router = express.Router()
const controller = require('../controller/employee_controller')
const auth = require('../middleware/auth_middleware')

router.post('/Register',controller.Register)
router.post('/login',controller.login)
router.put('/employee_update',auth,controller.employee_update)










module.exports = router
