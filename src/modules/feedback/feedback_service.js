import prisma from '../../config/db.js'

// ─── Item Ratings ────────────────────────────────────────────────────

async function rateItem(sessionId, itemId, rating) {
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5')
  }

  const item = await prisma.menuItem.findUnique({ where: { id: itemId } })
  if (!item) throw new Error('Menu item not found')

  return await prisma.itemRating.upsert({
    where: {
      itemId_sessionId: { itemId, sessionId },
    },
    update: { rating },
    create: { itemId, sessionId, rating },
  })
}

// ─── Item Feedback ───────────────────────────────────────────────────

async function createItemFeedback(sessionId, itemId, message) {
  const item = await prisma.menuItem.findUnique({ where: { id: itemId } })
  if (!item) throw new Error('Menu item not found')

  if (!message || !message.trim()) {
    throw new Error('Message is required')
  }

  return await prisma.itemFeedback.create({
    data: { itemId, sessionId, message },
  })
}

// ─── General Feedback ────────────────────────────────────────────────

async function createGeneralFeedback(sessionId, message) {
  if (!message || !message.trim()) {
    throw new Error('Message is required')
  }

  return await prisma.generalFeedback.create({
    data: { sessionId, message },
  })
}

// ─── Staff-facing reads/deletes ──────────────────────────────────────

// One entry per item that has at least one comment, with its average
// rating (from ItemRating) and its comments (from ItemFeedback), newest
// first. Items with zero comments are simply absent — not padded with
// fabricated review counts.
async function getItemReviews() {
  const items = await prisma.menuItem.findMany({
    where: { itemFeedback: { some: {} } },
    include: {
      itemFeedback: { orderBy: { createdAt: 'desc' } },
      itemRatings: true,
    },
  })

  return items.map((item) => {
    const ratings = item.itemRatings
    const avgRating = ratings.length
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : null
    return {
      item: {
        id: item.id,
        name: item.name,
        image: item.imageUrl,
      },
      avgRating,
      reviewCount: item.itemFeedback.length,
      // Reshaped to match what RatingsCommentsPage/FeedbackCard actually
      // read (`comment`, `created_at`) instead of the raw Prisma column
      // names (`message`, `createdAt`) — this was the actual cause of
      // comments showing up blank on the staff Ratings & Comments page.
      // There's no per-comment rating in the data model (ratings and
      // written feedback are two independent tables/writes), so this
      // intentionally omits a `rating` field per comment; FeedbackCard
      // already treats a missing rating as "don't show stars for this
      // row" rather than erroring.
      comments: item.itemFeedback.map((c) => ({
        id: c.id,
        comment: c.message,
        created_at: c.createdAt,
      })),
    }
  })
}

async function deleteItemFeedback(id) {
  return await prisma.itemFeedback.delete({ where: { id } })
}

async function getGeneralFeedbackList() {
  const list = await prisma.generalFeedback.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return list.map((f) => ({
    id: f.id,
    comment: f.message,
    created_at: f.createdAt,
  }))
}

async function deleteGeneralFeedback(id) {
  return await prisma.generalFeedback.delete({ where: { id } })
}

export default {
    rateItem,
    createItemFeedback,
    createGeneralFeedback,
    getItemReviews,
    deleteItemFeedback,
    getGeneralFeedbackList,
    deleteGeneralFeedback
}