import prisma from '../../config/db.js'

async function getCatagories() {
  return await prisma.category.findMany()
}

async function getActiveCatagories() {
  return await prisma.category.findMany({
    where: {
      isActive: true
    },
    include: {
      menuItems: {
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
          isAvailable: true,
          shortDescription: true,
          showHome: true,
        },
        orderBy: { displayOrder: 'asc' },
      },
    },
  })
}

async function getActiveCatagoriesFlat() {
  return await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  })
}

async function createCategory(data) {
  return await prisma.category.create({
    data: {
      name: data.name,
      icon: data.icon ?? null,
      displayOrder: data.displayOrder ?? 0,
      isActive: data.isActive ?? true,
    },
  })
}

async function updateCategory(id, data) {
  return await prisma.category.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.icon !== undefined && { icon: data.icon }),
      ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  })
}

async function deleteCategory(id) {
  return await prisma.category.delete({
    where: { id },
  })
}

// ─── Menu Items ──────────────────────────────────────────────────────

async function getMenuItems(categoryId) {
  const where = categoryId ? { categoryId: Number(categoryId) } : {}
  return await prisma.menuItem.findMany({
    where,
    include: { category: true },
    orderBy: { displayOrder: 'asc' },
  })
}

async function createMenuItem(data) {
  return await prisma.menuItem.create({
    data: {
      categoryId: data.categoryId,
      name: data.name,
      description: data.description ?? null,
      shortDescription: data.shortDescription ?? null,
      price: data.price,
      imageUrl: data.imageUrl ?? null,
      isAvailable: data.isAvailable ?? true,
      showHome: data.showHome ?? false,
      displayOrder: data.displayOrder ?? 0,
    },
    include: { category: true },
  })
}

async function updateMenuItem(id, data) {
  return await prisma.menuItem.update({
    where: { id },
    data: {
      ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
      ...(data.showHome !== undefined && { showHome: data.showHome }),
      ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
    },
    include: { category: true },
  })
}

async function deleteMenuItem(id) {
  return await prisma.menuItem.delete({
    where: { id },
  })
}

async function toggleItemAvailability(id) {
  const item = await prisma.menuItem.findUnique({ where: { id } })
  if (!item) throw new Error('Menu item not found')

  return await prisma.menuItem.update({
    where: { id },
    data: { isAvailable: !item.isAvailable },
    include: { category: true },
  })
}

async function getAllFeedbacks(page = 1, limit = 10) {
  const skip = (page - 1) * limit

  const [feedbacks, total] = await Promise.all([
    prisma.generalFeedback.findMany({
      skip,
      take: limit,
      include: {
        session: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.generalFeedback.count(),
  ])

  return {
    data: feedbacks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

async function getMenuItem(id) {
  return await prisma.menuItem.findFirst({
    where: { id },
  })
}

// Total items + per-category breakdown, including categories with 0
// items — a manager scanning for a gap in the menu needs to see "Drinks:
// 0" just as much as "Coffee: 12".
async function getStatistics() {
  const [categories, items] = await Promise.all([
    prisma.category.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.menuItem.findMany({ select: { categoryId: true } }),
  ])

  const byCategory = categories.map((category) => ({
    category,
    itemCount: items.filter((i) => i.categoryId === category.id).length,
  }))

  return {
    totalItems: items.length,
    byCategory,
  }
}
async function createRestaurantTable(tableNumber) {
  const table = await prisma.restaurantTable.create({
        data: {
            tableNumber: tableNumber
        }
      })
  return table
}
async function getTableByNumber(tableNumber) {
  return await prisma.restaurantTable.findFirst({
    where: {
      tableNumber: tableNumber
    }
  })
}
export default { 
    getCatagories,
    getActiveCatagories,
    getActiveCatagoriesFlat,
    createCategory, 
    updateCategory, 
    deleteCategory, 
    getMenuItems, 
    createMenuItem, 
    updateMenuItem, 
    deleteMenuItem,
    toggleItemAvailability,
    getAllFeedbacks, // buhala kezi awetawalew
    getMenuItem,
    getStatistics,
    createRestaurantTable,
    getTableByNumber
}

