import { Request, Response, NextFunction } from "express";
import Joi, { func } from "joi";
import { AppDataSource } from "../config/db";
import { Game } from "../models/game";
import { User } from "../models/user";

const NewGameSchema = Joi.object({
    level: Joi.string().valid('easy', 'normal', 'hard').required()
});

const ActionSchema = Joi.object({
    x: Joi.number().integer().required(),
    y: Joi.number().integer().required()
});


export function validateNewGameFields(req: Request, res: Response, next: NextFunction){
    NewGameSchema.validateAsync(req.body)
    .then(value => {
        next();
    })
    .catch(error => {
        res.status(400).json(error);
    });
}

export function validateActionFields(req: Request, res: Response, next: NextFunction){
    ActionSchema.validateAsync(req.body)
    .then(v => {
        next();
    })
    .catch(error => {
        res.status(400).json(error);
    })
}


export function userDeleted(req: Request, res: Response, next: NextFunction){
    const userId = req.user?.id;

    if(userId){
        AppDataSource.manager.getRepository(User).findOneBy({id: userId})
        .then(us => {
            if(us && us.deleted === true){
                res.status(404).json({message: "User deleted"});
            }
            else{
                next();
            }
        })
    }
    else{
        res.status(500).json({message: "Something went wrong in auth"});
    }
}

export function maxGames(req: Request, res: Response, next: NextFunction){
    const userId = req.user?.id;

    console.log(userId);
    if(userId){
        AppDataSource.manager.getRepository(Game).createQueryBuilder("games")
            .where("userId = :id", {id: userId})
            .execute()
        .then(games => {
            if(games.length < (process.env.MAX_GAMES || 10)){
                next()
            }
            else{
                res.status(400).json({message: "Cannont create more games"});
            }
        });
    }
    else{
        res.status(500).end();
    }
}
