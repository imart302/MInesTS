import { Router } from "express";
import passport from "passport";
import { login } from "../controllers/auth";


const router = Router();


router.post("/", [passport.authenticate('login', {session: false})], login);


export default router;
