import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import { AppError } from '../utils/appError.js'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 3 * 1024 * 1024   // 3MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    // crypto hash + original extension → no collisions, no spaces, no exploits
    const hash = crypto.randomBytes(16).toString('hex')
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${hash}${ext}`)      // e.g. a3f9b2c17e4d4a2b.jpg
  },
})

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new AppError('UPLOAD_ERROR', 'Only JPEG, PNG and WebP images are allowed', 400))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
})