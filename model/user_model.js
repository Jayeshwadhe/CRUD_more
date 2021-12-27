
const mongoose = require('mongoose')

//Create schema
const userSchema = new mongoose.Schema({

    name : {type: String},
    email : {type: String},
    password: {type: String},
    mobile: {type: Number},
    isverified:{type: Boolean,default: false},
    isdeleted:{type: Boolean,default: false},
    token:{type: String}
},
    { 
        timestamps: true 
    });


module.exports = mongoose.model('Users',userSchema)