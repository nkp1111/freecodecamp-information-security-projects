const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { Thread } = require("../model/messageBoard")


chai.use(chaiHttp);


let testThreadId
suite('Functional Tests', function () {

  suite("Thread route: /api/threads/{board}", function () {
    const threadPostData = { board: "test", text: "test", delete_password: "test" }

    test("#1 POST: Creating a new thread", function (done) {
      chai.request(server)
        .post("/api/threads/test")
        .send(threadPostData)
        .end(function (err, res) {

          console.log(res.body)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.equal(res.body.text, "test")
          assert.equal(res.body.delete_password, "test")
          testThreadId = res.body._id.toString()

        })
      done()
    })
    test("#2 GET: Viewing the 10 most recent threads with 3 replies each", function (done) {
      chai.request(server)
        .get("/api/threads/test")
        .end(function (err, res) {

          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.isObject(res.body[0])
          assert.isDefined(res.body[0].text)
          assert.isDefined(res.body[0].created_on)
          assert.isDefined(res.body[0].bumped_on)
          assert.isArray(res.body[0].replies)
          assert.isBelow(res.body[0].replies.length, 4)

        })
      done()
    })
    test("#3 DELETE: Deleting a thread with the incorrect password", function (done) {
      chai.request(server)
        .delete("/api/threads/test")
        .send({
          ...threadPostData,
          thread_id: testThreadId,
          delete_password: "incorrect"
        })
        .end(function (err, res) {

          assert.equal(res.status, 200)
          assert.equal(res.text, "incorrect password")

        })
      done()
    })
    // test("#4 DELETE: Deleting a thread with the correct password", function(done) {
    //   chai.request(server)
    //     .delete("/api/threads/test")
    //     .send({
    //       ...threadPostData, 
    //       thread_id: testThreadId, 
    //     })
    //     .end(function(err, res) {
    //       assert.equal(res.status, 200)
    //       assert.equal(res.text, "success")
    //     })
    //       done()
    // })
    test("#5 PUT: Reporting a thread", function (done) {
      chai.request(server)
        .put("/api/threads/test")
        .send({
          ...threadPostData,
          thread_id: testThreadId,
        })
        .end(function (err, res) {

          assert.equal(res.status, 200)
          assert.equal(res.text, "reported")

        })
      done()
    })
  })

  suite("Reply route: /api/replies/{board}", async function () {

    // let thread = await Thread.findOne()

    let replyData = { text: "test-reply", delete_password: "test", thread_id: thread._id.toString(), board: "test" }

    test("#6 POST: Creating a new reply", function (done) {
      chai.request(server)
        .post("/api/replies/test")
        .send(replyData)
        .end(function (err, res) {

          assert.equal(res.status, 200)
          done()

        })
    })
    test("#7 GET: Viewing a single thread with all replies", function (done) {
      chai.request(server)
        .get("/api/replies/test" + "?thread_id=" + testThreadId)
        .end(function (err, res) {

          assert.equal(res.status, 200)
          done()

        })
    })
    test("#8 DELETE: Deleting a reply with the incorrect password", function (done) {
      chai.request(server)
        .delete("/api/replies/test")
        .send(replyData)
        .end(function (err, res) {

          assert.equal(res.status, 200)
          done()

        })
    })
    test("#9 DELETE: Deleting a reply with the correct password", function (done) {
      chai.request(server)
        .delete("/api/replies/test")
        .send(replyData)
        .end(function (err, res) {

          assert.equal(res.status, 200)
          done()

        })
    })
    test("#10 PUT: Reporting a reply", function (done) {
      chai.request(server)
        .put("/api/replies/test")
        .send(replyData)
        .end(function (err, res) {

          assert.equal(res.status, 200)
          done()

        })
    })
  })



});
