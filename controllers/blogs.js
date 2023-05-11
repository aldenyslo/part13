const router = require("express").Router()
require("express-async-errors")

const { Blog, User } = require("../models")

const { tokenExtractor } = require("../utils/middleware")

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
  })
  res.json(blogs)
})

router.post("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({ ...req.body, userId: user.id })
  res.status(201).json(blog)
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.put("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.delete("/:id", [blogFinder, tokenExtractor], async (req, res) => {
  if (req.blog && req.blog.userId === req.decodedToken.id) {
    await req.blog.destroy()
  }
  res.status(204).end()
})

module.exports = router
