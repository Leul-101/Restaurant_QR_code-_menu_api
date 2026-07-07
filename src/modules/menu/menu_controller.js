import menuService from './menu_service.js'
import helper from '../../utils/helper.js'

async function getCatagoriesController(req, res, next) {
  try {
    const catagories = await menuService.getCatagories()
    res.json(catagories)
  } catch (err) {
    next(err)
  }
}

// Public, flat category list — no auth required. Used by CategoryPage's
// chip rail on the customer app, which needs every active category but
// none of the nested items (that's a separate call per category).
async function getPublicCategoriesController(req, res, next) {
  try {
    const categories = await menuService.getActiveCatagoriesFlat()
    res.json(categories)
  } catch (err) {
    next(err)
  }
}

async function getActiveCatagoriesController(req, res, next) {
  try {
    const categories = await menuService.getActiveCatagories()

    const formattedCategories = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      items: cat.menuItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        image: item.imageUrl,
        is_available: item.isAvailable,
        short_description: item.shortDescription,
        show_home: item.showHome,
      })),
    }))

    res.json({
      success: true,
      data: {
        categories: formattedCategories,
      },
    })
  } catch (err) {
    next(err)
  }
}

async function createCategoryController(req, res, next) {
  try {
    const category = await menuService.createCategory(req.body)
    res.status(201).json(category)
  } catch (err) {
    next(err)
  }
}

async function updateCategoryController(req, res, next) {
  try {
    const id = Number(req.params.id)
    const category = await menuService.updateCategory(id, req.body)
    res.json(category)
  } catch (err) {
    next(err)
  }
}

async function deleteCategoryController(req, res, next) {
  try {
    const id = Number(req.params.id)
    await menuService.deleteCategory(id)
    res.json({ message: 'Category deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// ─── Menu Item Controllers ──────────────────────────────────────────

async function getMenuItemsController(req, res, next) {
  try {
    const { categoryId } = req.query
    const items = await menuService.getMenuItems(categoryId)
    res.json(items)
  } catch (err) {
    next(err)
  }
}

async function createMenuItemController(req, res, next) {
  try {
    const item = await menuService.createMenuItem(req.body)
    res.status(201).json(item)
  } catch (err) {
    next(err)
  }
}

async function updateMenuItemController(req, res, next) {
  try {
    const id = Number(req.params.id)
    const item = await menuService.updateMenuItem(id, req.body)
    res.json(item)
  } catch (err) {
    next(err)
  }
}

async function deleteMenuItemController(req, res, next) {
  try {
    const id = Number(req.params.id)
    await menuService.deleteMenuItem(id)
    res.json({ message: 'Menu item deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// Accepts an explicit { is_available } from the frontend (StaffMenuPage's
// availability switch sends the value it wants, it doesn't just want a
// toggle). Falls back to toggling the current value if no body is sent,
// so any older caller relying on toggle-only behavior still works.
async function patchItemIsAvaleble(req, res, next) {
    try {
        const id = Number(req.params.id)
        const { is_available } = req.body
        const item = is_available === undefined
          ? await menuService.toggleItemAvailability(id)
          : await menuService.updateMenuItem(id, { isAvailable: !!is_available })
        res.json(item)
    } catch (err) {
        next(err)
    }
}

async function getMenuItemController(req, res, next) {
    try {
        const id = Number(req.params.id)
        const item = await menuService.getMenuItem(id)
        res.json(item)
    } catch (err) {
        next(err)
    }
}

// Standalone upload: no item id required. Returns a URL the frontend
// attaches to whatever create/update payload it sends next — matches the
// two-step flow staffService.js already expects (upload -> get URL ->
// include URL in item payload), instead of the old one-step version that
// required the item to already exist.
async function uploadItemImage(req, res, next) {
  try{
    const { path } = req.file
    res.json({ url: `/uploads/${path.split(/[\\/]/).pop()}` })
  }catch (err){
    next(err)
  }
}

async function getStatisticsController(req, res, next) {
  try {
    const stats = await menuService.getStatistics()
    res.json(stats)
  } catch (err) {
    next(err)
  }
}

async function createTableController(req, res, next) {
  try{
    const { tableNumber, url} = req.query
    const table = await menuService.getTableByNumber(Number(tableNumber))
    if (!table){
      const newTable = await menuService.createRestaurantTable(Number(tableNumber))
      await helper.generateQrCode({
        URL: url,
        tableNumber: Number(tableNumber),
        darkColor: '#000000',
        correction: 'H',
        width: 500,
        margin: 2
      })

      return res.redirect(`/uploads/table-${tableNumber}.png`)
    }
    return res.redirect(`/uploads/table-${tableNumber}.png`)
  }catch(err){
    next(err)
  }
}

export default { 
    getCatagoriesController, 
    getPublicCategoriesController,
    getActiveCatagoriesController,
    createCategoryController, 
    updateCategoryController, 
    deleteCategoryController,
    getMenuItemsController,
    createMenuItemController,
    updateMenuItemController,
    deleteMenuItemController,
    patchItemIsAvaleble,
    getMenuItemController,
    uploadItemImage,
    getStatisticsController,
    createTableController
}
