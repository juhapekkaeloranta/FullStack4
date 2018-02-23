const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/', async (request, response) => {
  try {
    console.log('hello from POST')
    console.log('TOKEN: ', request.token)
    const body = request.body

    if (!body.title || !body.url) {
      console.log('NOT GOOD BLOG!');
      return response.status(400).json({ error: 'title and url are compulsory' })
    }

    // set hard coded user id until login is implemented
    //body.userId = body.userId === undefined ? "5a8c92923e882e08d7788714" : body.userId
    const userIdFromToken = (jwt.verify(request.token, process.env.SECRET)).id
    const user = await User.findById(userIdFromToken)

    console.log('user:', user)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)

    await user.save() 

    return response.status(201).json(savedBlog)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

blogsRouter.get('/:id', (request, response) => {
  console.log('get const userIdFromToken = (jwt.verify(request.token, process.env.SECRET)).idone -route')
  console.log(request.params.id)
  Blog
    .findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.status(200).json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      response.status(400).send({ error: 'get failed' })
    })
})

blogsRouter.put('/:id', (request, response) => {
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

blogsRouter.delete('/:id', async (request, response) => {
  console.log('delete-route')
  const blogId = request.params.id
  
  //const blogToDelete = await Blog.findOne({ author: blogId })  
  const blogCreatorId = (await Blog.findOne({ author: "Richard Rest" })).user.toString()
  const userIdFromToken = (jwt.verify(request.token, process.env.SECRET)).id

  console.log('owner: ', blogCreatorId)
  console.log('signed:', userIdFromToken)
  if (userIdFromToken !== blogCreatorId) {
    return response.status(401).send({ error: 'Unauthorized to delete this item!'})
  }

  Blog
    .deleteOne({ _id: blogId })
    .then(() => {
      console.log('success!')
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'delete failed' })
    })  
})

module.exports = blogsRouter