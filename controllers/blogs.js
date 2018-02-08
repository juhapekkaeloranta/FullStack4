const blogsRouter = require('express').Router()
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

module.exports = blogsRouter