const express = require('express')
const router = express.Router()
const controller = require('../controller/auth_controller')
const auth = require('../middleware/auth_middleware')

router.post('/signup',controller.signup)
router.post('/login',controller.login)
router.delete('/delete_api',auth,controller.delete_api)
router.put('/update_api',auth,controller.update_api)
router.delete('/delete_ap',auth,controller.delete_ap)





module.exports= router
