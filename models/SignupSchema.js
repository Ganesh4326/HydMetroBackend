const mongoose = require('mongoose');

const SignupSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    repassword:{
        type:String,
        required:true
    },
})

const collection=mongoose.model("HydMetroSignup",SignupSchema)

module.exports=collection

