const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  suite("Thread route: /api/threads/{board}", function () {

    const threadPostData = { board: "test", text: "test", delete_password: "test" }
    let testThreadId
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
          done()

        })
    })
    test("#3 DELETE: Deleting a thread with the incorrect password", function (done) {
      chai.request(server)
        .delete("/api/threads/test")
        .send(threadData)
        .end(function (err, res) {

          assert.equal(res.status, 200)
          done()

        })
    })
    test("#4 DELETE: Deleting a thread with the correct password", function (done) {
      chai.request(server)
        .delete("/api/threads/test")
        .send(threadData)
        .end(function (err, res) {

          assert.equal(res.status, 200)
          done()

        })
    })
    test("#5 PUT: Reporting a thread", function (done) {
      chai.request(server)
        .put("/api/threads/test")
        .send(threadData)
        .end(function (err, res) {

          assert.equal(res.status, 200)
          done()

        })
    })
  })

  suite("Reply route: /api/replies/{board}/{thread}", function () {
    test("#6 POST: Creating a new reply", function (done) {
      chai.request(server)
        .post("/api/threads/test")
        .send(replyData)
        .end(function (err, res) {

          assert.equal(res.status, 200)
          done()

        })
    })
    test("#7 GET: Viewing a single thread with all replies", function (done) {
      chai.request(server)
        .get("/api/threads/test")
        .end(function (err, res) {

          assert.equal(res.status, 200)
          done()

        })
    })
    test("#8 DELETE: Deleting a reply with the incorrect password", function (done) {
      chai.request(server)
        .delete("/api/threads/test")
        .send(replyData)
        .end(function (err, res) {

          assert.equal(res.status, 200)
          done()

        })
    })
    test("#9 DELETE: Deleting a reply with the correct password", function (done) {
      chai.request(server)
        .delete("/api/threads/test")
        .send(replyData)
        .end(function (err, res) {

          assert.equal(res.status, 200)
          done()

        })
    })
    test("#10 PUT: Reporting a reply", function (done) {
      chai.request(server)
        .put("/api/threads/test")
        .send(replyData)
        .end(function (err, res) {

          assert.equal(res.status, 200)
          done()

        })
    })
  })



});
