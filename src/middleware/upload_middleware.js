import { upload } from '../config/multer.js'

export const uploadSingle = upload.single('file')