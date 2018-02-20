const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

const allBlogs = () => {
  return Blog.find({})
}

module.exports = {
  allBlogs
}