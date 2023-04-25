import  express from 'express'
import {  createUser, userList } from './controller.js'

const router= express.Router()

router.get('/' ,userList)

router.post('/',async(req,res)=>{
    try{
        res.json(await createUser(req.body))
    }
    catch(e){'Problem creating user'

    }
})







export default router