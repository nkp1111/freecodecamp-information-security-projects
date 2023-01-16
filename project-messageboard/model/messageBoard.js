const mongoose = require("mongoose")

// Model: MessageBoard
// Schema: threadSchema, replySchema

const threadSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  created_on: {
    type: Datetime,
    required: true,
    default: new Date(),
  },
  bumped_on: {
    type: Datetime,
    required: true,
    default: new Date(),
  },
  reported: {
    type: Bool,
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
  text: {
    type: String,
  },
  created_on: {
    type: Datetime,
    required: true,
    default: new Date(),
  },
  reported: {
    type: Bool,
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

export { Thread, Reply }