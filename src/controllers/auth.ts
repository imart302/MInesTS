import { JsonWebTokenError, Jwt, sign, SignOptions } from "jsonwebtoken"
import { Request, Response } from "express"
import { User } from "../models/user";


export function login(req: Request, res: Response){
    
    if(req.user){
        const token = sign({
            email: req.user.email,
            id: req.user.id
            
        },
        process.env.JWTSECRET || "jwttest1234",
        {expiresIn: '5h'});

        res.status(200).json({token});
    }
    else{
        res.status(400).json({message: "Something went wrong"});
    }
}
    

