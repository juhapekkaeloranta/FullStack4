const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', (request, response) => {
    response.json('hello2')
  })

blogsRouter.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)
  if (!blog.likes) {
    blog.likes = 0
  }

  if (!blog.title || !blog.url) {
    console.log('NOT GOOD BLOG!');
    return response.status(400).json({ error: 'title and url are compulsory' })
  }

  const asyncSave = async () => {
    const result = await blog.save()
    return response.status(201).json(result)
  }
  
  asyncSave()
})

module.exports = blogsRouter