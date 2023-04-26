import  express from 'express'
import {  createUser, login, userList } from './controller.js'

const router= express.Router()

router.get('/' ,userList)

router.post('/',async(req,res)=>{
    try{
        res.json(await createUser(req.body))
    }
    catch(e){return res.status(404).json('Something went wrong')}
})

router.post('/log',async(req,res)=>{
    try{
        res.json(await login(req.body))
    }
    catch(e){'Problem logging user'}
})







export default router