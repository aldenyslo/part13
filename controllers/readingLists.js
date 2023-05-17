const router = require("express").Router()
require("express-async-errors")

const { ReadingList } = require("../models")

const { tokenExtractor } = require("../utils/middleware")

router.post("/", async (req, res) => {
  const readingList = await ReadingList.create(req.body)
  res.status(201).json(readingList)
})

router.put("/:id", tokenExtractor, async (req, res) => {
  const readingList = await ReadingList.findByPk(req.params.id)

  if (readingList && readingList.userId === req.decodedToken.id) {
    console.log(readingList.read)
    readingList.read = req.body.read
    await readingList.save()
    res.json(readingList)
  } else {
    res.status(404).end()
  }
})

module.exports = router
