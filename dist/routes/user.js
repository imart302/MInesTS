"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const user_2 = require("../middleware/user");
const router = (0, express_1.Router)();
router.post('/', [user_2.validateNewUserFields, user_2.existsMail], user_1.createUser);
//router.get("/:id", getUser);
//router.put("/:id", updateUser);
router.delete('/:id', user_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.js.map