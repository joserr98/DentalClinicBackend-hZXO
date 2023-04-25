import User from "./model.js";
import bcrypt from 'bcrypt'
import { error } from "console";
import  config  from '../../core/conf.js'
import jwt from 'jsonwebtoken'

export const userList=async(req,res)=>{
   const userList1= await User.find({})
   return res.json(userList1)
}
