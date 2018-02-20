const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
  User
    .find({})
    .then(res => {
      response.json(res)
    })
})

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    if (body.password.length < 3) {
      return response.status(403).json({ error: 'password too short' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    })

    const savedUser = await user.save()

    return response.json(savedUser)
  } catch (exception) {
    console.log(exception)
    return response.status(500).json({ error: 'something went wrong...' })
  }
})

module.exports = usersRouter