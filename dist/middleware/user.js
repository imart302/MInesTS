"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.existsMail = exports.validateNewUserFields = void 0;
const joi_1 = __importDefault(require("joi"));
const db_1 = require("../config/db");
const user_1 = require("../models/user");
const CreateSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(3).required()
});
const validateNewUserFields = (req, res, next) => {
    CreateSchema.validateAsync(req.body)
        .then((val) => {
        next();
    })
        .catch(error => {
        res.status(400).json(error);
    });
};
exports.validateNewUserFields = validateNewUserFields;
const existsMail = (req, res, next) => {
    db_1.AppDataSource.manager.getRepository(user_1.User).findOneBy({ email: req.body.email })
        .then(user => {
        if (user) {
            res.status(400).json({ message: "Not a valid email" });
        }
        else {
            next();
        }
    })
        .catch(error => {
        res.status(500).end();
    });
};
exports.existsMail = existsMail;
//# sourceMappingURL=user.js.map