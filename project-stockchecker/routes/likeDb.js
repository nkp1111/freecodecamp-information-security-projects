const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
  }
})

const UserSchema = new mongoose.Schema({
  user: {
    type: String,
  }
})

const Like = mongoose.model('Like', likeSchema)
const User = mongoose.model("User", UserSchema)

const checkUserPresence = async (user) => {
  const userExists = await User.findOne({ "user": user })
  console.log(userExists)
  if (userExists) {
    console.log("user is here")
    return true
  } else {
    console.log("user is not here")
    await User.create({ user })
    return false
  }
}

const getSymbolLike = async (symbol, like) => {
  const symbolExists = await Like.findOne({ "title": symbol })
  if (symbolExists) {
    console.log("symbol is here")
    if (like) {
      symbolExists.likes += 1
      await symbolExists.save()
    }
    return symbolExists.likes
  } else {
    console.log("symbol is not here")
    await Like.create({
      title: symbol,
      likes: like ? 1 : 0
    })
    return like ? 1 : 0
  }
}

module.exports = { Like, User, checkUserPresence, getSymbolLike }