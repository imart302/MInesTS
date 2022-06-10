import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { AppDataSource } from "../config/db";
import { User } from "../models/user";


const CreateSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required()
});


export const validateNewUserFields = (req: Request, res: Response, next: NextFunction) => {
    CreateSchema.validateAsync(req.body)
    .then((val) => {
        next();
    })
    .catch(error => {
        res.status(400).json(error);
    });
}   


export const existsMail = (req: Request, res: Response, next: NextFunction) => {
    AppDataSource.manager.getRepository(User).findOneBy({email: req.body.email})
    .then(user => {
        if(user){
            res.status(400).json({message: "Not a valid email"});
        }
        else{
            next();
        }
    })
    .catch(error => {
        res.status(500).end();
    })
}