"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
function login(req, res) {
    if (req.user) {
        const token = (0, jsonwebtoken_1.sign)({
            email: req.user.email,
            id: req.user.id
        }, process.env.JWTSECRET || "jwttest1234", { expiresIn: '5h' });
        res.status(200).json({ token });
    }
    else {
        res.status(400).json({ message: "Something went wrong" });
    }
}
exports.login = login;
//# sourceMappingURL=auth.js.map