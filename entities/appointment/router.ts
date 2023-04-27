import express from 'express'
import {createAppointment, modifyAppointment, deleteAppointment, listAppointment} from './controller.js'
import { auth } from '../../core/middleware.js'

const router = express.Router();

router.get('/', auth, async (req, res, next)=> {
    try {
        res.json(await listAppointment(req))
    } catch(e) {
        next(e)
    } 
});

router.post("/", auth, async(req, res, next) => {
    try {
        res.json(await createAppointment(req))
    } catch(e) {
        next(e)
    } 
});

router.delete("/:id", auth, async(req, res, next) => {
    try {
        res.json(await deleteAppointment(req))
    } catch(e) {
        next(e)
    } 
});

router.put("/:id", auth, async(req, res, next) => {
    try {
        res.json(await modifyAppointment(req))
    } catch(e) {
        next(e)
    } 
})

export default router

