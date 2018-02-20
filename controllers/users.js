const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', (request, response) => {
    response.json('hello2')
  })

module.exports = usersRouter