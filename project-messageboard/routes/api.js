'use strict';
const { Thread, Reply } = require("../model/messageBoard")


module.exports = function (app) {

  app.route('/api/threads/:board')
    .post(async (req, res) => {
      // POST ROUTE
      const { board } = req.params
      const { text, delete_password } = req.body

      const thread = await Thread.create({
        board,
        text,
        delete_password,
        replies: [],
      })
      // console.log("post thread", thread)
      res.send(thread)
    })
    .get(async (req, res) => {
      // GET ROUTE
      const { board } = req.params
      let threads = await Thread.find({ board }).sort("-bumped_on").populate("replies")

      threads = threads.map(thread => {
        let threadToView = {
          _id: thread._id,
          text: thread.text,
          created_on: thread.created_on,
          bumped_on: thread.bumped_on,
          replies: thread.replies.sort((a, b) => a.created_on - b.created_on).slice(0, 3).map(reply => {
            let rep = {
              id: reply._id,
              text: reply.text,
              created_on: reply.created_on,
            }
            return rep
          }),
        }
        return threadToView
      }).slice(0, 10)
      // console.log("get thread", threads[0])
      res.send(threads)
    })
    .delete(async (req, res) => {
      // DELETE ROUTE
      const { board, thread_id, delete_password } = req.body
      let threadToDelete = await Thread.findById(thread_id)
      // console.log("delete thread", threadToDelete, threadToDelete.delete_password, delete_password)
      if (threadToDelete && threadToDelete.delete_password === delete_password) {
        await threadToDelete.remove()
        res.send("success")
      } else {
        res.send("incorrect password")
      }
    })
    .put(async (req, res) => {
      // PUT ROUTE
      const { board, thread_id } = req.body
      const threadToUpdate = await Thread.findById(thread_id)
      // console.log("put thread", threadToUpdate)
      if (threadToUpdate) {
        threadToUpdate.reported = true
        await threadToUpdate.save()
        res.send("reported")
      } else {
        res.send("incorrect thread id")
      }
    })

  app.route('/api/replies/:board')
    .post(async (req, res) => {
      // POST ROUTE
      const { board } = req.params
      const { text, delete_password, thread_id } = req.body
      const reply = new Reply({
        board,
        text,
        delete_password,
        thread_id,
      })

      let threadToUpdate = await Thread.findById(thread_id)
      threadToUpdate.replies.push(reply)
      threadToUpdate.bumped_on = new Date()
      await threadToUpdate.save()

      console.log("post reply", reply, threadToUpdate)
      res.send(reply)
    })
    .get(async (req, res) => {
      const { thread_id } = req.query
      let thread = await Thread.findById(thread_id).populate("replies")

      let threadToView = {
        _id: thread._id,
        text: thread.text,
        created_on: thread.created_on,
        bumped_on: thread.bumped_on,
        replies: thread.replies.map(reply => {
          return {
            _id: reply._id,
            text: reply.text,
            created_on: reply.created_on,
          }
        }),

      }

      console.log("get reply", threadToView)
      res.send(threadToView)
    })
  // .delete(async (req, res) => {
  //   res.send("hello")
  // })
  // .put(async (req, res) => {
  //   res.send("hello")
  // })

};
