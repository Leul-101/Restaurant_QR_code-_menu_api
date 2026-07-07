import auth_controller from "./auth_controller.js";
import auth_middleware from "../../middleware/auth_middleware.js";
import { Router } from "express";
import passport from "passport";

const authRouter = Router()

authRouter.post('/login', auth_controller.adminLoginController)
authRouter.post('/logout', auth_controller.logoutController)

authRouter.get('/me',
    passport.authenticate('jwt',{session: false}),
    auth_middleware.isAdmin,
    (req, res)=>{
        const {id, username} = req.user
        return res.status(200).json({
        status: 'success',
        data: { id, username }
        })
    }
)

export default {authRouter}
