const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  const { name, email, password } = req.body
  if (!email || !name || !password) {
    throw new BadRequestError('please provide name, email, password')
  }
  email = email.toLowerCase()
  const tempUser = { name, email, password }
  const user = await User.create({ ...tempUser })
  const token = user.createJwt()
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('please provide email and password')
  }
  email = email.toLowerCase()
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError(`user does'nt exist`)
  }
  const verify = await user.verify(password)
  if (!verify) {
    throw new UnauthenticatedError(`incorrect password`)
  }
  const token = user.createJwt()
  const name = user.name
  res.json({ name, token })
}

module.exports = {
  register,
  login,
}
