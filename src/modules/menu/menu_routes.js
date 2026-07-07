import { Router } from "express";
import menuControllers from "./menu_controller.js"
import sessionMiddleware from "../../middleware/session_middleware.js";
import passport from "passport";
import { uploadSingle } from "../../middleware/upload_middleware.js";

const adminRouter = Router()
const generalMenuRouter = Router()

// ─── Auth middleware ──────────────────────────────────────────────────
const authJwt = passport.authenticate('jwt', { session: false })

// ─── Public routes (mounted at /menu in app.js) ────────────────────────
// GET /menu                -> full menu, categories with nested items
// GET /menu/categories      -> flat category list (for CategoryPage's chip rail)
// GET /menu/items           -> items, optionally filtered by ?categoryId=
// GET /menu/items/:id       -> single item
generalMenuRouter.get('/', sessionMiddleware, menuControllers.getActiveCatagoriesController)
generalMenuRouter.get('/categories', sessionMiddleware, menuControllers.getPublicCategoriesController)
generalMenuRouter.get('/items', sessionMiddleware, menuControllers.getMenuItemsController)
generalMenuRouter.get('/items/:id', sessionMiddleware, menuControllers.getMenuItemController)

// ─── Admin routes (mounted at /staff in app.js) ─────────────────────────
// Category management
adminRouter.get('/categories', authJwt, menuControllers.getCatagoriesController)
adminRouter.post('/categories', authJwt, menuControllers.createCategoryController)
adminRouter.put('/categories/:id', authJwt, menuControllers.updateCategoryController)
adminRouter.delete('/categories/:id', authJwt, menuControllers.deleteCategoryController)

// Item management — under /menu/items to match the frontend's staffService.js calls
adminRouter.get('/menu/items', authJwt, menuControllers.getMenuItemsController)
adminRouter.post('/menu/items', authJwt, menuControllers.createMenuItemController)
adminRouter.put('/menu/items/:id', authJwt, menuControllers.updateMenuItemController)
adminRouter.patch('/menu/items/:id', authJwt, menuControllers.patchItemIsAvaleble)
adminRouter.delete('/menu/items/:id', authJwt, menuControllers.deleteMenuItemController)

//table creation

adminRouter.get('/table', authJwt, menuControllers.createTableController)

// Statistics
adminRouter.get('/statistics/items', authJwt, menuControllers.getStatisticsController)

// Image upload — standalone, does NOT require an existing item id.
// Returns { url }, which the frontend then includes in the create/update
// item payload itself. This lets AddItemPage attach an image to an item
// that doesn't exist in the DB yet.
adminRouter.post('/uploads/images', authJwt, uploadSingle, menuControllers.uploadItemImage)

export default { adminRouter, generalMenuRouter }
