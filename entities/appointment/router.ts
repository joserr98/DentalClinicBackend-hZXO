import express from 'express'
import {createAppointment} from './controller.js'


const router = express.Router();

router.post("/", async(req, res, next) => {
    try {
        res.json(await createAppointment(req.body))
    } catch(e) {
        next(e)
    } 
});

export default router