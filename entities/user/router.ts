import  express from 'express'
import {  createUser, deleteUser, login, updateUser, userList } from './controller.js'
import { auth } from '../../core/middleware.js'

const router= express.Router()

router.get('/' ,auth,async(req,res)=>{
    try{
        res.json(await userList(req))
    }
    catch(e){return res.status(404).json('user not found')

    }

})

router.post('/', async(req,res)=>{
    try{
        res.json(await createUser(req.body))
    }
    catch(e){return res.status(404).json('Something went wrong')}
})

router.post('/log',async(req,res)=>{
    try{
        res.json(await login(req.body))
    }
    catch(e){return res.status(404).json('Problem logging user')}
})

router.put('/:id',auth,async(req,res)=>{
    try{
        res.json(await updateUser(req))
    }
    catch(e){return res.status(404).json('Problem updating user')}
})

router.delete('/:id',auth,async(req,res)=>{
    try{
        console.log(1)
        res.json(await deleteUser(req))
    }
    catch(e){
        return res.status(404).json('Error can not delete user')
    }

})


export default router