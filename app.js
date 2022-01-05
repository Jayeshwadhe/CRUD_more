const express = require("express")
const app = express()
const authroute = require('./routes/user_routes')
const employeeroute = require('./routes/employee_routes')
const bodyparser = require('body-parser')
const swaggerUi=require('swagger-ui-express');
const swaggerDocument=require('./swagger.json');

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use('/emp',employeeroute)
app.use('/auth',authroute)




require('./config/db')

 

app.listen(3000,()=>{
    console.log('server is running......!!')
})

