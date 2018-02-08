const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

/*
const mongoose = require('mongoose')

const Blog = mongoose.model('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number
})

const mongoUrl = 'mongodb://blog-app:789456123@ds229008.mlab.com:29008/dev-blog-db'
mongoose.connect(mongoUrl)
mongoose.Promise = global.Promise

module.exports = Blog
*/
const Blog = require('./models/blog')

app.use(cors())
app.use(bodyParser.json())

app.get('/', (request, response) => {
    response.json('hello2')
  })

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})