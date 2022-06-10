import { Request, Response } from "express";
import { User } from "../models/user";
import { AppDataSource } from "../config/db";

export function createUser(req: Request, res: Response){
    const { email, password } = req.body;
    const us = new User();
    us.email = email;
    us.password = password;
    
    AppDataSource.manager.save(us)
    .then((val) => {
        res.status(200).json(us);
    })
    .catch(error => {
        res.status(500).end();
    })
}


export function deleteUser(req: Request, res: Response){
    console.log("Deleting user");
    const { id } = req.params;
    AppDataSource.manager.getRepository(User).findOneBy({ id: parseInt(id)})
    .then(user => {
        if(user){
            user.deleted = true;
            AppDataSource.manager.save(user);
            res.status(200).json(user);
        }
        else{
            res.status(400).json({message: "User not found"});
        }
    })
    .catch(error => {
        res.status(500).end();
    });
}

