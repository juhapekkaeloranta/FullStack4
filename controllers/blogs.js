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

blogsRouter.get('/api/blogs/:id', (request, response) => {
  console.log('get one -route');
  Blog
    .findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      response.status(400).send({ error: 'get failed' })
    })
})

blogsRouter.put('/api/blogs/:id', (request, response) => {
  console.log('edit one -route')

  const updatedBlog = {
    _id: request.body._id,
    title: request.body.title,
    url: request.body.url,
    likes: request.body.likes
  }

  console.log(updatedBlog);

  Blog
    .findByIdAndUpdate(updatedBlog._id, updatedBlog, {new: true})
    .then(blog => {
      response.json(blog)
    })
    .catch(error => {
      response.status(400).send({ error: 'update failed' })
    })
})

blogsRouter.delete('/api/blogs/:id', (request, response) => {
  console.log('delete-route')
  console.log(request.params)
  Blog
    .deleteOne({ _id: request.params.id })
    .then(() => {
      console.log('success!')
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'delete failed' })
    })
})

module.exports = blogsRouter