import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import path from 'node:path'

//routers
import auth_routes from './modules/auth/auth_routes.js'
import menu_routes from './modules/menu/menu_routes.js'
import feedback_routes from './modules/feedback/feedback_routes.js'
import analytics_routes from './modules/analytics/analytics_routes.js'
//middleware imports
import authmid from './middleware/auth_middleware.js'

//error handler (yhen melshe mayet alebgn)
import { errorMiddleware } from './middleware/error_middleware.js'

const app = express()

app.set("trust proxy", true);

app.use(cors({
  origin: (origin, callback) => {
    callback(null, true); // allow every origin
  },
  credentials: true                // Allows the browser to pass cookies back and forth
}))

app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())

passport.use(authmid.jwtStrategy)

app.use('/uploads', express.static(path.resolve("uploads"))) // i have to run from the root 4 this to work

// ─── Route prefixes ──────────────────────────────────────────────────
// /auth   -> login/logout/me (admin)
// /menu   -> public, customer-facing menu browsing (session cookie only)
// /staff  -> protected, admin-only menu + item management + reviews/feedback/stats
// /items  -> public, visitor ratings/feedback writes (session cookie only)
// /analytics -> protected, admin-only
app.use('/auth', auth_routes.authRouter)
app.use('/menu', menu_routes.generalMenuRouter)
app.use('/staff', menu_routes.adminRouter)
app.use('/staff', feedback_routes.adminFeedbackRouter)
app.use('/items', feedback_routes.feedbackRouter)
app.use('/analytics', analytics_routes.analyticsRouter)

//error handler middleware
app.use(errorMiddleware)

export default app