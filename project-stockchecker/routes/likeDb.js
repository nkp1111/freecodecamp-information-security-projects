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

const checkUserPresence = async (user) => {
  const userExists = await User.findOne({ "user": user })
  if (userExists) {
    console.log("user is here")
    return true
  } else {
    console.log("user is not here")
    let newone = new User({
      user: user
    })
    newone.save()
    return false
  }
}

const checkSymbolPresence = async (symbol) => {
  const symbolExists = await Like.findOne({ "title": symbol })
  if (symbolExists) {
    console.log("symbol is here")
    return symbolExists
  } else {
    console.log("symbol is not here")
    return false
  }
}

module.exports = { Like, User, checkUserPresence, checkSymbolPresence }