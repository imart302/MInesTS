import { Router } from "express";
import passport from "passport";
import { createGame, gameAction, deleteGame, actionHistory} from "../controllers/game";
import { validateNewGameFields, validateActionFields, userDeleted, maxGames } from "../middleware/game";

const router = Router();

router.use(passport.authenticate('jwt', {session: false}));
router.use(userDeleted);

router.post('/', [validateNewGameFields, maxGames], createGame);
router.get('/:game_id/action', actionHistory)
router.post('/:game_id/action', [validateActionFields], gameAction);
router.delete('/:game_id', deleteGame);


export default router;


