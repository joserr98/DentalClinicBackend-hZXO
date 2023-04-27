import jwt from 'jsonwebtoken'
import confs from './conf.js'
import { Response, NextFunction} from 'express'

export const auth = (req, res: Response, next: NextFunction)=>{
    if(!req.headers.authorization) return next(new Error('AUTH_REQUIRED'));
    const token = req.headers.authorization.split(' ')[1];
    if(!token) return next(new Error('AUTH_REQUIRED'));
    try {
        req.token= jwt.verify(token, confs.SECRET)
        next();
    } catch(e){
        return next(new Error('TOKEN_INVALID'));
    }
    
}
