const { ValidationError } = require("sequelize")
const jwt = require("jsonwebtoken")

const { User, ActiveSession } = require("../models")

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

const sessionFrom = async (token) => {
  return await ActiveSession.findOne({
    where: {
      token,
    },
    include: {
      model: User,
    },
  })
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization")

  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "token missing" })
  }

  const session = await sessionFrom(authorization.substring(7))

  if (!session) {
    return res.status(401).json({ error: "no valid session" })
  }

  if (session.user.disabled) {
    return res.status(401).json({ error: "account disabled" })
  }

  req.user = session.user

  next()
}

module.exports = { errorHandler, tokenExtractor }
