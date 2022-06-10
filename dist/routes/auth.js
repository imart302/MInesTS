"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const auth_1 = require("../controllers/auth");
const router = (0, express_1.Router)();
router.post("/", [passport_1.default.authenticate('login', { session: false })], auth_1.login);
exports.default = router;
//# sourceMappingURL=auth.js.map