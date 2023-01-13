const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  likes: {
    type: [String],
  }
})

const UserSchema = new mongoose.Schema({
  user: {
    type: String,
  }
})

const Like = mongoose.model('Like', likeSchema)
const User = mongoose.model("User", UserSchema)

module.exports = { Like, User }