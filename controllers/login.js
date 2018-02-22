const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })

  const passwdCorrect = user === null ?
    false :
    await bcrypt.compare(body.password, user.passwordHash)

  if (!user || !passwdCorrect) {
    return response.status(401).send({ error: 'incorrect username or passoword '})
  }

  return response.status(200).end()
})

module.exports = loginRouter