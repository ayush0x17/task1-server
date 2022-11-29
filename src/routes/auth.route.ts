import express from "express"
import { postLogIn, postLogOut } from "../controllers/auth.controller";
import passport from "../middlewares/passport.middleware";
import validateAsset from "../middlewares/validateAsset.middleware";
import { loginUserSchema } from "../schemas/user.schema";

const router = express.Router()

router.get('/', (req, res) => {
    res.status(200).send(req.user)
})


router.post('/login', validateAsset(loginUserSchema), passport.authenticate('local', { failureRedirect: '/login' }), postLogIn)

router.post('/logout', postLogOut)


export default router