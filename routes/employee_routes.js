const express = require('express')
const router = express.Router()
const controller = require('../controller/employee_controller')
const auth = require('../middleware/auth_middleware')


/**
 * @swagger
 * definitions:
 *  Register:
 *   type: string
 *   properties:
 *    name:
 *     type: string
 *     description: name of the employee
 *     example: 'Jayaramachandran'
 *    email:
 *     type: string
 *     description: email of the employee
 *     example: 'jayaramachandran@whizpath.com'
 *    password:
 *     type: string
 *     description: password of the employee
 *     example: 'jayesh@123'
 *    phoneno:
 *     type: string
 *     description: phoneno. of the employee
 *     example: '8770132674'
 *    salary:
 *     type: string
 *     description: salary of the employee
 *     example: '2500'
 *    gender:
 *     type: string
 *     description: gender of the employee
 *     example: 'male'
 *     birthday:
 *     type: string
 *     description: birthday of the employee
 *     example: '08-11-1998'
 *     city:
 *     type: string
 *     description: city of the employee
 *     example: 'indore'
 *  login:
 *   type: string
 *   properties:
 *    email:
 *     type: string
 *     description: email of the employee
 *     example: 'jayaramachandran@whizpath.com'
 *    password:
 *     type: string
 *     description: password of the login employee
 *     example: 'employee@123'
 */


 /**
  * @swagger
  * /Register:
  *  post:
  *   summary: create employee
  *   description: create employee for the organisation
  *   requestBody:
  *    content:
  *     application/json:
  *      schema:
  *       $ref: '#/definitions/e_users'
  *   responses:
  *    200:
  *     description: employee created succesfully
  *    500:
  *     description: failure in creating employee
  */
router.post('/Register',controller.Register)
router.post('/login',controller.login)
router.put('/employee_update',auth,controller.employee_update)
router.put('/reset_password',auth,controller.reset_password)
router.get('/EmployeeDetails',auth,controller.EmployeeDetails)
router.get('/EmpBday',auth,controller.EmpBday)









module.exports = router
