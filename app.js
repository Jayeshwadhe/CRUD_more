const express = require("express")
const app = express()
const authroute = require('./routes/auth_routes')
const bodyparser = require('body-parser')

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));


app.use(authroute)
require('./config/db')
 

app.listen(3000,()=>{
    console.log('server is running......')
})

