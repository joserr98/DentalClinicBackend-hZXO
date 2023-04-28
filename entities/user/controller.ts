import User from "./model.js";
import bcrypt from 'bcrypt'
import  config  from '../../core/conf.js'
import jwt from 'jsonwebtoken'

export const userList=async(req)=>{
    
    if(req.token.role=='client'){
    return User.find({_id:req.token.id})}
    else{
        return User.find({})
    }
}
export const updateUser=async(data)=>{
    if(data.token.role=='client'){

      const user= await User.findOne({_id:data.params.id})
       await User.updateOne({_id:data.params.id},data.body)
       if(!user) throw new Error('ajnfdk')
       return await user.save()

       
    }

}

export const createUser= async(data)=>{
    if(!data.password || data.password.lenght < 5) throw new Error('Invalid Password')
    data.password = await bcrypt.hash(data.password, config.SALT_ROUND)
    return User.create(data)

}

export const login= async(data)=>{
    const user=await User.findOne({email:data.email});
    if(!user) return null;
    if(!(await bcrypt.compare(data.password,user.password))) return null;
    const token= jwt.sign({id: user._id, role: user.role}, config.SECRET, {expiresIn: '24h'})
    return{token}
}


