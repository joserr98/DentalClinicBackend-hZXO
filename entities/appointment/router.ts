import express from 'express'
import {createAppointment, modifyAppointment} from './controller.js'


const router = express.Router();

router.post("/", async(req, res, next) => {
    try {
        res.json(await createAppointment(req.body))
    } catch(e) {
        next(e)
    } 
});

router.put("/:id", async(req, res, next) => {
    try {
        res.json(await modifyAppointment(req))
    } catch(e) {
        next(e)
    } 
})

export default router

