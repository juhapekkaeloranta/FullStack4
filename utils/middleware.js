const jwt = require('jsonwebtoken')

const logger = (request, response, next) => {
  if (process.env.NODE_ENV === 'test') {
    return next()
  }
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const tokenExtractor = (request, response, next) => {
  /*if (process.env.NODE_ENV === 'test') {
    console.log('using test env token')
    request['token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI1YTkwMjFjNzljMTVjMzMwZGJmNTA4NGUiLCJpYXQiOjE1MTk0MDQ0ODF9.SMjGNQfSWBYCnkxjsTrOq2XsSo5hUlMyb8tly8zWPt8'
    const user = jwt.verify(request.token, process.env.SECRET)
    console.log(user)
    
    return next()
  }*/

  console.log('tokenExtractor:')

  const authorization = request.get('authorization')
  console.log('Incoming request, token found:', authorization !== undefined)
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const tokenStr = authorization.substring(7)
    request['token'] = tokenStr
    return next()
  }
  return next()
}

const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
  logger,
  error,
  tokenExtractor
}