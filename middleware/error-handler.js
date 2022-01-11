const { CustomAPIError, UnauthenticatedError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  if (err instanceof UnauthenticatedError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: err.message })
      .redirect('/login')
  }
  if (err.code == '11000') {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'account already exist' })
  }
  console.log(err)
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
}

module.exports = errorHandlerMiddleware
