const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', (request, response) => {
    response.json('hello2')
  })

blogsRouter.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      console.log(blogs)
      response.json(blogs)
    })
})

blogsRouter.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)
  
  if (!blog.likes) {
    blog.likes = 0
  }

  const asyncSave = async () => {
    const result = await blog.save()
    return response.status(201).json(result)
  }
 
  asyncSave()
})

module.exports = blogsRouter