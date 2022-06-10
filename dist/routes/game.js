"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const game_1 = require("../controllers/game");
const game_2 = require("../middleware/game");
const router = (0, express_1.Router)();
router.use(passport_1.default.authenticate('jwt', { session: false }));
router.use(game_2.userDeleted);
router.post('/', [game_2.validateNewGameFields, game_2.maxGames], game_1.createGame);
router.get('/:game_id/action', game_1.actionHistory);
router.post('/:game_id/action', [game_2.validateActionFields], game_1.gameAction);
router.delete('/:game_id', game_1.deleteGame);
exports.default = router;
//# sourceMappingURL=game.js.map