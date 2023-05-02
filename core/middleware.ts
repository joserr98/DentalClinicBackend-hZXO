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

export const handlerError = (err, req, res, next)=>{
    if(err.message === 'AUTH_REQUIRED') return res.status(403).json({error: 'AUTH_REQUIRED'})
    if(err.message === 'TOKEN_INVALID') return res.status(403).json({error: 'AUTH_REQUIRED'})
    if(err.message === 'NOT_FOUND') return res.status(404).json({error: 'NOT_FOUND'})
    if(err.message === 'PASSWORD_TOO_SHORT') return res.status(422).json({error: 'NOT_FOUND'})
    if(err.message === 'NO_APPOINTMENT') return res.status(422).json({error: 'NOT_FOUND'})
    if(err.message === 'UNAVAILABLE_DATE') return res.status(422).json({error: 'NOT_FOUND'})
    if(err.message === 'WRONG_DATE') return res.status(422).json({error: 'WRONG_DATE'})
    if(err.message === 'SERVICE_NOT_ALLOW') return res.status(402).json({error:'USER NOT FOUND'})
    if(err.message=== 'INVALID_PASSWORD') return res.status(402).res.json({error:'NOT FOUND'})
    if(err.message=== 'USER_NOT_FOUND') return res.status(402).res.json({error:'NOT FOUND'})
    if(err.message==='USER_NOT_FOUND') return res.status(402).res.json({error:'NOT FOUND'})
    if(err.message==='INVALID_USER_ROLE') return res.status(402).res.json({error:'CAN NOT MODIFY USER'})

    // If there is a non defined error sets status 500.
    console.error(err);
    return res.status(500).json({error: 'SERVER_ERROR', err})
}
