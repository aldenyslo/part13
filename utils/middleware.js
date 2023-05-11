const { ValidationError } = require("sequelize")
const jwt = require("jsonwebtoken")

const { SECRET } = require("../utils/config")

const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err instanceof ValidationError) {
    // Handle validation errors
    return res.status(400).json({ error: err.message })
  } else {
    // Handle other errors
    next(err)
  }
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization")

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: "token invalid" })
    }
  } else {
    return res.status(401).json({ error: "token missing" })
  }
  next()
}

module.exports = { errorHandler, tokenExtractor }
