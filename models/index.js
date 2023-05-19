const Blog = require("./blog")
const User = require("./user")
const ReadingList = require("./readingList")
const ActiveSession = require("./activeSession")

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, {
  through: ReadingList,
  as: "readings",
  onDelete: "CASCADE",
})
Blog.belongsToMany(User, {
  through: ReadingList,
  as: "readers",
  onDelete: "CASCADE",
})

User.hasMany(ActiveSession)
ActiveSession.belongsTo(User)

module.exports = { Blog, User, ReadingList, ActiveSession }
