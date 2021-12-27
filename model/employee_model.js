
const mongoose = require('mongoose')

//Create schema

const e_userschema = new mongoose.Schema({

    serialnumber:{type: Number},
    name:{type: String},
    email: {type: String},
    salt:{type:String},
    password: {type: String},
    phoneno:{type: Number},
    salary:{type:Number},
    gender:{type: String},
    dob:{type:Date},
    state: {type: String},
    city: {type: String}
},
{
    timestamps: true
})

module.exports = mongoose.model('E_User',e_userschema)
