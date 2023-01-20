const mongoose = require("mongoose")

// Model: MessageBoard
// Schema: threadSchema, replySchema


const replySchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  created_on: {
    type: Date,
    required: true,
    default: new Date(),
  },
  reported: {
    type: Boolean,
    default: false,
  },
  delete_password: {
    type: String,
    required: true,
  },
})


const threadSchema = new mongoose.Schema({
  board: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
  },
  created_on: {
    type: Date,
    required: true,
    default: new Date(),
  },
  bumped_on: {
    type: Date,
    required: true,
    default: new Date(),
  },
  reported: {
    type: Boolean,
    default: false,
  },
  delete_password: {
    type: String,
    required: true,
  },
  replies: [replySchema],
})

const Thread = mongoose.model("Thread", threadSchema)
const Reply = mongoose.model("Reply", replySchema)

module.exports = { Thread, Reply }