const jwt = require("jsonwebtoken")
const router = require("express").Router()

const { SECRET } = require("../utils/config")
const { User, ActiveSession } = require("../models")

const { tokenExtractor } = require("../utils/middleware")

router.post("/login", async (req, res) => {
  const body = req.body

  const user = await User.findOne({ where: { username: body.username } })

  const pwCorrect = body.password === "secret"

  if (!(user && pwCorrect)) {
    return res.status(401).json({
      error: "invalid username or password",
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  await ActiveSession.create({ userId: user.id, token })

  res.status(200).send({ token, username: user.username, name: user.name })
})

router.delete("/logout", tokenExtractor, async (req, res) => {
  console.log(req.user)
  await ActiveSession.destroy({ where: { userId: req.user.id } })

  res.status(200).send({ message: "token revoked" })
})

module.exports = router
