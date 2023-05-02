import User from "./model.js";
import bcrypt from 'bcrypt'
import  config  from '../../core/conf.js'
import jwt from 'jsonwebtoken'

export const userList=async(req)=>{
    
    const regexSurname= new RegExp(req.query.surname,'i')
    const regexpName= new RegExp(req.query.name,'i')
    if(req.token.role=='client'){    
    return User.find({_id:req.token.id,},{name:1,surname:1,phone_number:1,email:1,password:1,role:1})}
    else if(req.token.role=='dentist'){
        return User.find({name:regexpName,surname:regexSurname,deleted_at:null},{name:1,surname:1,phone_number:1,email:1,role:1})
    }
}


export const updateUser = async (data) => {
    if (data.token.role === 'client' && data.params.id === data.token.id) {
      const user = await User.findOne({ _id: data.params.id });
      if(data.body.role!=='client'){throw new Error('Clients are not allowed to change their role')}
      data.body.password = await bcrypt.hash(data.body.password, config.SALT_ROUND)
      data.body.updated_at = new Date();
      const updateUser= await User.findOneAndUpdate({ _id: data.params.id },{$set:data.body},{ returnDocument: 'after' });
      if (!user) {
        throw new Error('User not found, impossible to update');
      }
      return updateUser;
    } else if (data.token.role === 'dentist') {
      const user = await User.findById(data.params.id);
      if (!user) {
        throw new Error('User not found, impossible to update');
      }
      
      data.body.password = await bcrypt.hash(data.body.password, config.SALT_ROUND)
      data.body.updated_at = new Date();
      const updatedUser=await User.findOneAndUpdate({ _id: data.params.id },{$set:data.body},{ returnDocument: 'after' });
      return updatedUser 
    } else {
      throw new Error('Invalid user role');
    }
  };
  

export const createUser= async(data)=>{
    if(!data.password || data.password.lenght < 5) throw new Error('Invalid Password')
    data.password = await bcrypt.hash(data.password, config.SALT_ROUND)
    data.created_at=new Date()
    return User.create(data)

}

export const login= async(data)=>{
    const user=await User.findOne({email:data.email,deleted_at:null});
    if(!user) return ('user not found');
    if(!(await bcrypt.compare(data.password,user.password))) return null;
    const token= jwt.sign({id: user._id, role: user.role}, config.SECRET, {expiresIn: '24h'})
    return{token}
}

export const deleteUser= async (data) => {
    
  if (data.token.role === 'client' && data.params.id === data.token.id) {
    const user = await User.findOne({ _id: data.params.id });
    data.body.deleted_at = new Date();
    const updateUser= await User.findByIdAndUpdate({ _id: data.params.id },{$set:data.body},{ returnDocument: 'after' });
    if (!user) {
      throw new Error('User not found, impossible to update');
    }
    return updateUser;
  } else if (data.token.role === 'dentist') {
    const user = await User.findById(data.params.id);
    if (!user) {
      throw new Error('User not found, impossible to update');
    }
    data.body.deleted_at = new Date();
     const updatedUser=await User.findByIdAndUpdate({ _id: data.params.id },{$set:data.body},{ returnDocument: 'after' });
    return updatedUser 
  } else {
    throw new Error('Invalid user role');
  }
};


 


  

