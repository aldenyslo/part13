const router = require("express").Router()
const { fn, col } = require("sequelize")

const { Blog } = require("../models")

router.get("/", async (req, res) => {
  const blogsByAuthor = await Blog.findAll({
    attributes: [
      "author",
      [fn("COUNT", col("title")), "articles"],
      [fn("SUM", col("likes")), "likes"],
    ],
    group: "author",
    order: [["likes", "DESC"]],
  })
  res.json(blogsByAuthor)
})

module.exports = router
