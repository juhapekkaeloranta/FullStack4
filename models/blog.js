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