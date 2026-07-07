import ('dotenv/config')

const NODE_ENV = process.env.NODE_ENV
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET
const JWT_VISITOR_SECRET = process.env.JWT_VISITOR_SECRET
const PORT = process.env.PORT

export default {NODE_ENV, JWT_ADMIN_SECRET, JWT_VISITOR_SECRET, PORT}