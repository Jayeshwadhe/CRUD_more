
const mongoose = require('mongoose')

//Create schema
const userSchema = new mongoose.Schema({

    name : {type: String,require: true},
    email : {type: String,require: true},
    password: {type: String,require: true},
    mobile: {type: Number,require: true},
    isverified:{type: Boolean,defaultvalue: false},
    isdeleted:{type: Boolean,defaultvalue: false}
},
    { 
        timestamps: true 
    });


module.exports = mongoose.model('Users',userSchema)