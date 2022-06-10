"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxGames = exports.userDeleted = exports.validateActionFields = exports.validateNewGameFields = void 0;
const joi_1 = __importDefault(require("joi"));
const db_1 = require("../config/db");
const game_1 = require("../models/game");
const user_1 = require("../models/user");
const NewGameSchema = joi_1.default.object({
    level: joi_1.default.string().valid('easy', 'normal', 'hard').required()
});
const ActionSchema = joi_1.default.object({
    x: joi_1.default.number().integer().required(),
    y: joi_1.default.number().integer().required()
});
function validateNewGameFields(req, res, next) {
    NewGameSchema.validateAsync(req.body)
        .then(value => {
        next();
    })
        .catch(error => {
        res.status(400).json(error);
    });
}
exports.validateNewGameFields = validateNewGameFields;
function validateActionFields(req, res, next) {
    ActionSchema.validateAsync(req.body)
        .then(v => {
        next();
    })
        .catch(error => {
        res.status(400).json(error);
    });
}
exports.validateActionFields = validateActionFields;
function userDeleted(req, res, next) {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (userId) {
        db_1.AppDataSource.manager.getRepository(user_1.User).findOneBy({ id: userId })
            .then(us => {
            if (us && us.deleted === true) {
                res.status(404).json({ message: "User deleted" });
            }
            else {
                next();
            }
        });
    }
    else {
        res.status(500).json({ message: "Something went wrong in auth" });
    }
}
exports.userDeleted = userDeleted;
function maxGames(req, res, next) {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    console.log(userId);
    if (userId) {
        db_1.AppDataSource.manager.getRepository(game_1.Game).createQueryBuilder("games")
            .where("userId = :id", { id: userId })
            .execute()
            .then(games => {
            if (games.length < (process.env.MAX_GAMES || 10)) {
                next();
            }
            else {
                res.status(400).json({ message: "Cannont create more games" });
            }
        });
    }
    else {
        res.status(500).end();
    }
}
exports.maxGames = maxGames;
//# sourceMappingURL=game.js.map