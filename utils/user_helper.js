const User = require('../models/user')

const usersInDb = async () => {
  const users = await User.find({})
  return users
}

const findUser = async (userName) => {
  const user = (await User.find({ username: userName }))[0]
  return user
}
module.exports = {
  usersInDb, findUser
}