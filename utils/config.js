console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

console.log(process.env.PORT)
console.log(process.env.MONGODB_URI)

let port = process.env.PORT
let mongoUrl = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
  port = process.env.TEST_PORT
  mongoUrl = process.env.TEST_MONGODB_URI
}

module.exports = {
  mongoUrl,
  port
}