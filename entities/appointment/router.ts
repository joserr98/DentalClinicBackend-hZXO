import express from 'express'
import {createAppointment, deleteAppointment} from './controller.js'


const router = express.Router();

router.post("/", async(req, res, next) => {
    try {
        res.json(await createAppointment(req.body))
    } catch(e) {
        next(e)
    } 
});

router.delete("/:id", async(req, res, next) => {
    try {
        res.json(await deleteAppointment(req.params.id))
    } catch(e) {
        next(e)
    } 
});

export default router