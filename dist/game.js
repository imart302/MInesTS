"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
const action_1 = require("./action");
let Game = class Game {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Game.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 2000 }),
    __metadata("design:type", String)
], Game.prototype, "gridcurrent", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, (user) => user.games),
    __metadata("design:type", user_1.User)
], Game.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => action_1.Action, (action) => action.game),
    __metadata("design:type", Array)
], Game.prototype, "actions", void 0);
Game = __decorate([
    (0, typeorm_1.Entity)("games")
], Game);
exports.Game = Game;
//# sourceMappingURL=game.js.map