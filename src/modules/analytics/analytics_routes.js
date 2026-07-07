import { Router } from "express";
import analytics_controller from "./analytics_controller.js";
import passport from "passport";

const analyticsRouter = Router()

const authJwt = passport.authenticate('jwt', { session: false })

analyticsRouter.get('/scans', authJwt, analytics_controller.getScanCountController)

export default {
    analyticsRouter
}
