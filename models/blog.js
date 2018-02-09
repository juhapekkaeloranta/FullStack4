const mongoose = require('mongoose')
const config = require('../utils/config')

const Blog = mongoose.model('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number
})

console.log(config)
const mongoUrl = config.mongoUrl
mongoose.connect(mongoUrl)
mongoose.Promise = global.Promise

module.exports = Blog