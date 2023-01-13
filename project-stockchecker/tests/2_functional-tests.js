const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  test("Viewing one stock GET /api/stock-prices/", function (done) {
    chai.request(server)
      .get("/api/stock-prices?stock=GOOG")
      .end(function (err, res) {
        assert.equal(res.status, 200)
        done()
      })
  })

  test("#2 Viewing one stock and liking it: GET request /api/stock-prices/", function (done) {
    chai.request(server)
      .get("/api/stock-prices?stock=GOOG&like=true")
      .end(function (err, res) {
        assert.equal(res.status, 200)
        done()
      })
  })

  test("#3 Viewing the same stock and liking it again: GET request /api/stock-prices/", function (done) {
    chai.request(server)
      .get("/api/stock-prices?stock=GOOG&like=true")
      .end(function (err, res) {
        assert.equal(res.status, 200)
        done()
      })
  })

  test("#4 Viewing two stocks: GET request /api/stock-prices/", function (done) {
    chai.request(server)
      .get("/api/stock-prices?stock=GOOG&stock=MSFT")
      .end(function (err, res) {
        assert.equal(res.status, 200)
        done()
      })
  })

  test("#5 Viewing two stocks and liking them: GET request /api/stock-prices/", function (done) {
    chai.request(server)
      .get("/api/stock-prices?stock=GOOG&stock=MSFT&like=true")
      .end(function (err, res) {
        assert.equal(res.status, 200)
        done()
      })
  })
});
