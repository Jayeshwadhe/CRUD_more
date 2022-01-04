const express = require("express")
const app = express()
const authroute = require('./routes/user_routes')
const employeeroute = require('./routes/employee_routes')
const bodyparser = require('body-parser')
//const swaggerDocument=require('./swagger.json');
const swaggerJSDoc=require('swagger-jsdoc');
const swaggerUi=require('swagger-ui-express');

const swaggerOptions={
    definition:{
        openapi:'3.0.0',
        info:{
            title:'Employee Management API',
            version:'1.0.0',
            description:'Employe Api for employee management',

            servers:["http://localhost:3000"]
        }
    },
    apis:["app.js"]
}
const swaggerDocs=swaggerJSDoc(swaggerOptions);
//app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));


app.use(employeeroute)
app.use(authroute)
require('./config/db')
 

app.listen(3000,()=>{
    console.log('server is running......')
})

