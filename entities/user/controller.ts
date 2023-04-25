import User from "./model.js";
import bcrypt from 'bcrypt'
import  config  from '../../core/conf.js'
import jwt from 'jsonwebtoken'

export const userList=async(req,res)=>{
   const userList1= await User.find({})
   return res.json(userList1)
}

export const createUser= async(data)=>{
    if(!data.password || data.password.lenght < 5) throw new Error('Invalid Password')
    data.password = await bcrypt.hash(data.password, config.SALT_ROUND)
    data.role= 'client'
    return User.create(data)

}