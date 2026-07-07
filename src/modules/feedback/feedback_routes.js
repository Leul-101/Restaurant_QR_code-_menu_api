import { Router } from "express";
import feedback_controller from "./feedback_controller.js";
import sessionMiddleware from "../../middleware/session_middleware.js";
import passport from "passport";

const feedbackRouter = Router()
const adminFeedbackRouter = Router()

// ─── Auth middleware ──────────────────────────────────────────────────
const authJwt = passport.authenticate('jwt', { session: false })

//feedback routs (public, visitor session cookie — mounted at /items)

feedbackRouter.post('/:id/rate', sessionMiddleware, feedback_controller.rateItemController)
feedbackRouter.post('/:id/feedback', sessionMiddleware, feedback_controller.createItemFeedbackController)
feedbackRouter.post('/feedback', sessionMiddleware, feedback_controller.createGeneralFeedbackController)

// staff routes (protected — mounted at /staff)
adminFeedbackRouter.get('/reviews', authJwt, feedback_controller.getItemReviewsController)
adminFeedbackRouter.delete('/comments/:id', authJwt, feedback_controller.deleteCommentController)
adminFeedbackRouter.get('/feedback', authJwt, feedback_controller.getGeneralFeedbackListController)
adminFeedbackRouter.delete('/feedback/:id', authJwt, feedback_controller.deleteGeneralFeedbackController)

export default { feedbackRouter, adminFeedbackRouter }