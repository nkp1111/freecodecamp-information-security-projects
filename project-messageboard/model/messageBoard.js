const mongoose = require("mongoose")

// Model: MessageBoard
// Schema: threadSchema, replySchema

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
  replies: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }],
  }
})

const replySchema = new mongoose.Schema({
  board: {
    type: String,
    required: true,
  },
  text: {
    type: String,
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
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
  }
})

const Thread = mongoose.model("Thread", threadSchema)
const Reply = mongoose.model("Reply", replySchema)

module.exports = { Thread, Reply }