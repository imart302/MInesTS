"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.createUser = void 0;
const user_1 = require("../models/user");
const db_1 = require("../config/db");
function createUser(req, res) {
    const { email, password } = req.body;
    const us = new user_1.User();
    us.email = email;
    us.password = password;
    db_1.AppDataSource.manager.save(us)
        .then((val) => {
        res.status(200).json(us);
    })
        .catch(error => {
        res.status(500).end();
    });
}
exports.createUser = createUser;
function deleteUser(req, res) {
    console.log("Deleting user");
    const { id } = req.params;
    db_1.AppDataSource.manager.getRepository(user_1.User).findOneBy({ id: parseInt(id) })
        .then(user => {
        if (user) {
            user.deleted = true;
            db_1.AppDataSource.manager.save(user);
            res.status(200).json(user);
        }
        else {
            res.status(400).json({ message: "User not found" });
        }
    })
        .catch(error => {
        res.status(500).end();
    });
}
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.js.map