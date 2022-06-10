import { Router } from "express";
import {createUser, deleteUser} from '../controllers/user';
import { existsMail, validateNewUserFields } from "../middleware/user";

const router = Router();

router.post('/', [validateNewUserFields, existsMail], createUser);
//router.get("/:id", getUser);
//router.put("/:id", updateUser);
router.delete('/:id', deleteUser);

export default router;
