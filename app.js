const express = require("express")
const app = express()
const authroute = require('./routes/user_routes')
const employeeroute = require('./routes/employee_routes')
const bodyparser = require('body-parser')
const swaggerDocument=require('./swagger.json');
const swaggerUi=require('swagger-ui-express');


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(employeeroute)
app.use(authroute)
require('./config/db')
 

app.listen(3000,()=>{
    console.log('server is running......')
})

