const { User } = require('../models');

const getUsers = (req, res, next) => {
  User.find()
    .then(users => {
      res.send({ users });
    })
    .catch(next)
}

const getUserByUsername = (req, res, next) => {
  const { username } = req.params
  User.find({ username: username })
    .then(user => {
      user.length === 0
        ? next({ status: 404, message: `Page not found for username : ${username}` })
        : res.status(200).send({ user })
    })
    .catch(next)
}


module.exports = { getUsers, getUserByUsername }