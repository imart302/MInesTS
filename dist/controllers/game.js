"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionHistory = exports.deleteGame = exports.gameAction = exports.createGame = void 0;
const mines_1 = require("../clases/mines");
const db_1 = require("../config/db");
const action_1 = require("../models/action");
const game_1 = require("../models/game");
function createGame(req, res) {
    const rowColMap = new Map([["easy", 8], ["normal", 12], ["hard", 18]]);
    const numMinesMap = new Map([["easy", 10], ["normal", 30], ["hard", 60]]);
    const { level } = req.body;
    const user = req.user;
    console.log('Creating game');
    if (user) {
        const rows = rowColMap.get(level), cols = rowColMap.get(level);
        const num_mines = numMinesMap.get(level);
        if (rows && cols && num_mines) {
            const gamemines = new mines_1.Mines();
            gamemines.init(rows, cols, num_mines)
                .then(() => {
                console.log('rendering');
                return gamemines.renderdb();
            })
                .then((gridstr) => {
                console.log('creating value');
                let game = new game_1.Game();
                game.gridcurrent = gridstr;
                game.user = user;
                console.log(game);
                console.log('saving');
                db_1.AppDataSource.manager.save(game)
                    .then((us) => {
                    res.status(200).json(game);
                })
                    .catch(error => {
                    res.status(500).json(error);
                });
            })
                .catch(() => {
                res.status(500).end();
            });
        }
        else {
            res.status(500).json({ message: "Something went wrong in row, cols and num of mines" });
        }
    }
    else {
        res.status(404).json({ message: "User not found" });
    }
}
exports.createGame = createGame;
function gameAction(req, res) {
    const { x, y } = req.body;
    const { game_id } = req.params;
    db_1.AppDataSource.manager.getRepository(game_1.Game).findOneBy({ id: parseInt(game_id) })
        .then(game => {
        if (game) {
            if (game.status === 'FINISHED') {
                return res.status(200).json({ message: "This game has been finished" });
            }
            else {
                let mines = new mines_1.Mines();
                mines.load(game.gridcurrent)
                    .then(() => {
                    return mines.push(x, y);
                })
                    .then(gameresult => {
                    mines.renderdb()
                        .then(renderdb => {
                        mines.render()
                            .then(render => {
                            if (gameresult === 'LOSE') {
                                game.status = 'FINISHED';
                                game.gridcurrent = renderdb;
                                db_1.AppDataSource.manager.save(game);
                                res.status(200).json({ message: 'GAME OVER', map: render });
                            }
                            else if (gameresult === 'NOP') {
                                res.status(200).json({ message: 'NO OPERATION', map: render });
                            }
                            else if (gameresult === 'OUT') {
                                res.status(400).json({ message: 'ROW OR COL OUT OF BOUNDARIES' });
                            }
                            else if (gameresult === 'CONTINUE') {
                                game.gridcurrent = renderdb;
                                db_1.AppDataSource.manager.save(game);
                                const action = new action_1.Action();
                                action.x = x;
                                action.y = y;
                                action.game = game;
                                db_1.AppDataSource.manager.save(action);
                                res.status(200).json({ message: "Updated", map: render });
                            }
                            else if (gameresult === 'WIN') {
                                game.status = 'FINISHED';
                                game.gridcurrent = renderdb;
                                db_1.AppDataSource.manager.save(game);
                                const action = new action_1.Action();
                                action.x = x;
                                action.y = y;
                                action.game = game;
                                db_1.AppDataSource.manager.save(game);
                                res.status(200).json({ message: "You Win", map: render });
                            }
                        });
                    });
                });
            }
        }
        else {
            res.json(404).json({ message: "Game not found" });
        }
    })
        .catch(error => {
        res.status(500).json(error);
    });
}
exports.gameAction = gameAction;
function deleteGame(req, res) {
    const { game_id } = req.params;
    console.log(game_id);
    if (game_id) {
        db_1.AppDataSource.manager.getRepository(action_1.Action).createQueryBuilder("action")
            .delete()
            .where("game.id = :id", { id: game_id })
            .execute()
            .then(result => {
            console.log(result);
            db_1.AppDataSource.manager.getRepository(game_1.Game).createQueryBuilder("game")
                .delete()
                .where("id = :id", { id: game_id })
                .execute()
                .then(result2 => {
                res.status(200).json(result2);
            })
                .catch(error => {
                console.log(error);
                res.status(500).end();
            });
        })
            .catch(error => {
            res.status(500).end();
        });
    }
    else {
        res.status(400).end();
    }
}
exports.deleteGame = deleteGame;
function actionHistory(req, res) {
    const { game_id } = req.params;
    if (game_id) {
        console.log(game_id);
        db_1.AppDataSource.manager.getRepository(game_1.Game).findOneBy({ id: parseInt(game_id) })
            .then(game => {
            db_1.AppDataSource.manager.getRepository(action_1.Action)
                .createQueryBuilder("action")
                .leftJoinAndSelect("action.game", "game")
                .select([
                "action.id",
                "action.x",
                "action.y",
                "action.date"
            ])
                .where("game.id = :id", { id: game_id })
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
    else {
        res.status(400).json({ message: "field" });
    }
}
exports.actionHistory = actionHistory;
//# sourceMappingURL=game.js.map