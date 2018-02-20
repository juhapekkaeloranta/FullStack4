const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

const formatBlog = (blog) => {
  return {
    _id: blog._id,
    title: blog.title,
    url: blog.url,
    likes: blog.likes
  }
}

const allBlogs = async () => {
  console.log('getting all blogs')
  const blogs = await Blog.find({})
  const formatted = blogs.map(formatBlog)
  console.log(formatted)
  return formatted
}

const findBlog = async (blogId) => {
  console.log('finding a blog')
  const blog = await Blog.find({ _id: blogId })
  return blog.map(formatBlog)[0]
}

module.exports = {
  allBlogs, findBlog
}