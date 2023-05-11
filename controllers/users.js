const router = require("express").Router()
require("express-async-errors")

const { User, Blog } = require("../models")

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  })
  res.json(users)
})

router.post("/", async (req, res) => {
  const user = await User.create(req.body)
  res.status(201).json(user)
})

const userFinder = async (req, res, next) => {
  req.user = await User.findOne({ where: { username: req.params.username } })
  next()
}

router.put("/:username", userFinder, async (req, res) => {
  if (req.user) {
    req.user.username = req.body.username
    await req.user.save()
    res.json(req.user)
  } else {
    res.status(404).end()
  }
})

module.exports = router
