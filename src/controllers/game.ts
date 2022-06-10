import { Request, Response } from "express";
import { off } from "process";
import { Mines } from "../clases/mines";
import { AppDataSource } from "../config/db";
import { Action } from "../models/action";
import { Game } from "../models/game";
import { User } from "../models/user";



export function createGame(req: Request, res: Response){
    const rowColMap = new Map<string, number>([["easy", 8], ["normal", 12], ["hard", 18]]);
    const numMinesMap = new Map<string, number>([["easy", 10], ["normal", 30], ["hard", 60]]);

    const { level } = req.body;
    const user = req.user;

    console.log('Creating game');
    if(user){

        const rows = rowColMap.get(level), cols = rowColMap.get(level);
        const num_mines = numMinesMap.get(level);
        
        if(rows && cols && num_mines){
            const gamemines = new Mines();
            gamemines.init(rows, cols, num_mines)
            .then(() => { 
                console.log('rendering');
                return gamemines.renderdb()
            })
            .then((gridstr) => {
                console.log('creating value');
                let game = new Game();
                game.gridcurrent = gridstr;
                game.user = user;
                console.log(game);
                console.log('saving');
                AppDataSource.manager.save(game)
                .then((us) => {
                    res.status(200).json(game);
                })
                .catch(error => {
                    res.status(500).json(error);
                })
            })
            .catch(() => {
                res.status(500).end();
            });
        }
        else{
            res.status(500).json({message: "Something went wrong in row, cols and num of mines"});
        }
    }
    else{
        res.status(404).json({message: "User not found"});
    }
    
}

export function gameAction (req: Request, res: Response){
    const { x, y } = req.body;
    const { game_id } = req.params;
    
    AppDataSource.manager.getRepository(Game).findOneBy({id: parseInt(game_id)})
    .then(game => {
        if(game){
            if(game.status === 'FINISHED'){
                return res.status(200).json({message: "This game has been finished"});
            }
            else{
                let mines = new Mines();
                mines.load(game.gridcurrent)
                .then(() => {
                    return mines.push(x, y);
                })
                .then(gameresult => {
                    mines.renderdb()
                    .then(renderdb => {
                        mines.render()
                        .then(render => {
                            if(gameresult === 'LOSE'){
                                game.status = 'FINISHED';
                                game.gridcurrent = renderdb;
                                AppDataSource.manager.save(game);
                                res.status(200).json({message: 'GAME OVER', map: render});
                            }
                            else if(gameresult === 'NOP'){
                                res.status(200).json({message: 'NO OPERATION', map: render});
                            }
                            else if(gameresult === 'OUT'){
                                res.status(400).json({message : 'ROW OR COL OUT OF BOUNDARIES'});
                            }
                            else if(gameresult === 'CONTINUE'){
                                game.gridcurrent = renderdb;
                                AppDataSource.manager.save(game);
                                const action = new Action();
                                action.x = x
                                action.y = y;
                                action.game = game;
                                AppDataSource.manager.save(action);
                                res.status(200).json({message: "Updated", map: render});
                            }
                            else if(gameresult === 'WIN'){
                                game.status = 'FINISHED';
                                game.gridcurrent = renderdb;
                                AppDataSource.manager.save(game);
                                const action = new Action();
                                action.x = x;
                                action.y = y;
                                action.game = game;
                                AppDataSource.manager.save(game);
                                res.status(200).json({message: "You Win", map: render});
                            }
                        })
                    })
                })
            }
        }   
        else{
            res.json(404).json({message: "Game not found"});
        }
    })
    .catch(error => {
        res.status(500).json(error);
    });
}


export function deleteGame(req: Request, res: Response){
    const { game_id } = req.params;
    console.log(game_id);
    if(game_id){
        AppDataSource.manager.getRepository(Action).createQueryBuilder("action")
            .delete()
            .where("game.id = :id", {id: game_id})
            .execute()
        .then(result => {
            console.log(result);
            AppDataSource.manager.getRepository(Game).createQueryBuilder("game")
                .delete()
                .where("id = :id", {id: game_id})
                .execute()
            .then(result2 => {
                res.status(200).json(result2);
            })
            .catch(error => {
                console.log(error);
                res.status(500).end();
            })
        })
        .catch(error => {
            res.status(500).end();
        });
    }
    else{
        res.status(400).end();
    }
}

export function actionHistory(req: Request, res: Response){
    const { game_id } = req.params;
    if(game_id){
        console.log(game_id);
        AppDataSource.manager.getRepository(Game).findOneBy({id: parseInt(game_id)})
        .then(game => {
            AppDataSource.manager.getRepository(Action)
                .createQueryBuilder("action")
                .leftJoinAndSelect("action.game", "game")
                .select([
                    "action.id",
                    "action.x",
                    "action.y",
                    "action.date"
                ])
                .where("game.id = :id", {id: game_id})
                .getMany()
            .then(actions => {
                res.status(200).json(actions);
            })
            .catch(error => {
                res.status(500).end();
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).end();
        });
    }
    else{
        res.status(400).json({message: "field"})
    }
}