"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("../routes/user"));
const auth_1 = __importDefault(require("../routes/auth"));
const game_1 = __importDefault(require("../routes/game"));
const passport_1 = __importDefault(require("passport"));
const auth_2 = __importDefault(require("../config/auth"));
class Server {
    constructor() {
        //initialize the express app
        this.app = (0, express_1.default)();
        //set up first app middleware
        this.middleware();
        //set up app routes
        this.routes();
    }
    middleware() {
        (0, auth_2.default)(passport_1.default);
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(passport_1.default.initialize());
    }
    routes() {
        this.app.use('/user', user_1.default);
        this.app.use('/auth', auth_1.default);
        this.app.use('/game', game_1.default);
    }
    listen() {
        this.app.listen(process.env.PORT || 5000, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map