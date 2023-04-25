import  express from 'express'
import {  userList } from './controller.js'

const router= express.Router()

router.get('/' ,userList)

// router.post('/',async(req,res)=>{
//     try{
//         res.json(await createUser(req.body))
//     }
//     catch(e){

//     }
// })






export default router