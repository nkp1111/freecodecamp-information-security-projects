'use strict';
let axios = require("axios")
const bcrypt = require("bcrypt")
let symbols
let baseUrl = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/"
let data
let data2
let { Like, User } = require("./likeDb")

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      symbols = req.query.stock
      const like = req.query.like

      if (like) {
        const currentUser = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        checkUser(currentUser)
      }

      // for more than one symbol 
      if (Array.isArray(symbols)) {
        for (let s of symbols) {
          await axios.get(baseUrl + s.toUpperCase() + "/quote")
            .then(res => {
              if (!data) {
                data = res["data"]
              } else {
                data2 = res["data"]
              }
            })
        }
        // for one symbol 
      } else {
        await axios.get(baseUrl + symbols.toUpperCase() + "/quote")
          .then(res => data = res["data"])
      }

      if (!data2) {
        // response for one symbol 
        res.send({
          "stockData": {
            "stock": symbols,
            "price": data["previousClose"],
            "likes": 1
          }
        })
      } else {
        // response for two symbol
        res.send({
          "stockData": [
            { "stock": symbols[0], "price": parseFloat(data["previousClose"]), "rel_likes": 1 },
            { "stock": symbols[1], "price": parseFloat(data["previousClose"]), "rel_likes": 1 }]
        })
      }
    });
};

function checkUser(user) {
  // check if current user is old user or new one
  User.find().then(async data => {
    let userip = user.split(":").slice(-1,)[0].split(".").join("")
    let hashedip = await bcrypt.hash(user, 12)
    console.log(hashedip, data)

    if (data.indexOf(hashedip) !== -1) {
      return true
    } else {
      let newone = new User({
        user: hashedip
      })
      await newone.save()
      return false
    }
  })

}