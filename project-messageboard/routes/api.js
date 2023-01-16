'use strict';
const { Thread, Reply } = require("../model/messageBoard")

module.exports = function (app) {

  app.route('/api/threads/:board')

    .post(async function (req, res) {
      const { board } = req.params
      const { text, delete_password } = req.body

      const thread = await Thread.create({
        board,
        text,
        delete_password,
      })
      res.redirect(`/b/${board}/`)
    })

    .get(async function (req, res) {
      const { board } = req.params
      let boardToShow = await Thread.find({ board }).sort("-bumped_on").populate("replies")
      console.log("board get")
      boardToShow = boardToShow.map(thread => {
        let threadToView = {
          id: thread._id,
          text: text,
          created_on: created_on,
          bumped_on: bumped_on,
          replies: thread.replies.slice(0, 3),
          board: board,
        }
        return threadToView
      }).slice(0, 10)
      res.send(boardToShow)
    })

    .delete(async function (req, res) {
      const { board } = req.params
      const { thread_id, delete_password } = req.body
      console.log("thread delete", thread_id, delete_password)
      const threadToDelete = await Thread.findOne({ _id: thread_id })
      if (!threadToDelete) {
        res.send("incorrect password")
      } else if (threadToDelete && threadToDelete.delete_password !== delete_password) {
        res.send("incorrect password")
      }
      else {
        await threadToDelete.remove()
        res.send("success")
      }
    })


  app.route('/api/replies/:board')
    .post(async function (req, res) {
      const { board } = req.params
      const { text, delete_password, thread_id } = req.body

      const reply = await Reply.create({
        board,
        text,
        delete_password,
        thread_id
      })

      const threadToUpdate = await Thread.find({ _id: thread_id })
      threadToUpdate.replies.push(reply._id)
      threadToUpdate.bumped_on = new Date()
      await threadToUpdate.save()
      res.redirect("")
    })

    .get(async function (req, res) {
      const { board } = req.params
      const { thread_id } = req.query
      console.log("reply get", thread_id, board)
      const threadsToView = await Thread.find({ _id: thread_id })
      res.send(threadsToView)
    })

    .delete(async function (req, res) {
      const { board } = req.params
      const { thread_id, reply_id, delete_password } = req.body
      console.log("reply delete", thread_id, reply_id, delete_password)
      const threadFromDelete = await Thread.findOne({ _id: thread_id })
      if (!threadFromDelete) {
        res.send("incorrect password")
      }
      const replyToDelete = threadFromDelete.replies.find(reply => reply.id === reply_id)
      if (!replyToDelete) {
        res.send("incorrect password")
      } else if (replyToDelete && replyToDelete.delete_password !== delete_password) {
        res.send("incorrect password")
      } else {
        threadFromDelete.replies.remove(replyToDelete)
        threadFromDelete.bumped_on = new Date()

        await Reply.deleteOne(replyToDelete)
        await threadFromDelete.save()
        res.send("[deleted]")
      }

    })



};
