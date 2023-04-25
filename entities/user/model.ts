import mongoose from "mongoose";

const User= mongoose.model('User', new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    surname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,

    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    role:{
        type:String,
        required:true,
        enum:['client','dentist']

    },
    phone_number:{
        type:Number,
        required: true

    }
}))

export default User