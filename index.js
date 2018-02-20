const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const blogsRoutes = require('./controllers/blogs')
const config = require('./utils/config')

mongoose.connect(config.mongoUrl)
mongoose.Promise = global.Promise

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use(middleware.logger)

app.use('/', blogsRoutes)

app.use(middleware.error)

const server = http.createServer(app)

const PORT = 3003

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

server.on('close', () => {
  console.log('SERVER CLOSING!');
  mongoose.connection.close()
  console.log('mongoose connection closed!');
})

module.exports = {
  app, server
}