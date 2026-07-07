import feedbackService from "./feedback_service.js";

// ─── Rate Item ───────────────────────────────────────────────────────

async function rateItemController(req, res, next) {
  try {
    const { rating } = req.body
    const { id: itemId } = req.params
    const result = await feedbackService.rateItem(req.visitor.id, Number(itemId), Number(rating))
    res.json(result)
  } catch (err) {
    next(err)
  }
}

// ─── Create Item Feedback ────────────────────────────────────────────

async function createItemFeedbackController(req, res, next) {
  try {
    const { message } = req.body
    const { id: itemId } = req.params
    const result = await feedbackService.createItemFeedback(req.visitor.id, Number(itemId), message)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

// ─── Create General Feedback ─────────────────────────────────────────

async function createGeneralFeedbackController(req, res, next) {
  try {
    const { message } = req.body
    const result = await feedbackService.createGeneralFeedback(req.visitor.id, message)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

// ─── Staff-facing reads/deletes ──────────────────────────────────────

async function getItemReviewsController(req, res, next) {
  try {
    const reviews = await feedbackService.getItemReviews()
    res.json(reviews)
  } catch (err) {
    next(err)
  }
}

async function deleteCommentController(req, res, next) {
  try {
    const id = Number(req.params.id)
    await feedbackService.deleteItemFeedback(id)
    res.json({ message: 'Comment deleted successfully' })
  } catch (err) {
    next(err)
  }
}

async function getGeneralFeedbackListController(req, res, next) {
  try {
    const feedback = await feedbackService.getGeneralFeedbackList()
    res.json(feedback)
  } catch (err) {
    next(err)
  }
}

async function deleteGeneralFeedbackController(req, res, next) {
  try {
    const id = Number(req.params.id)
    await feedbackService.deleteGeneralFeedback(id)
    res.json({ message: 'Feedback deleted successfully' })
  } catch (err) {
    next(err)
  }
}

export default {
  rateItemController,
  createItemFeedbackController,
  createGeneralFeedbackController,
  getItemReviewsController,
  deleteCommentController,
  getGeneralFeedbackListController,
  deleteGeneralFeedbackController
}
