'use strict';
let axios = require("axios")
const bcrypt = require("bcrypt")

let baseUrl = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/"
let { Like, User, checkUserPresence } = require("./likeDb")

module.exports = function (app) {

  // ----------------------------------------------------- //
  const checkUser = async (user) => {
    // check current user presence in database
    let userip = user.split(":").slice(-1,)[0].split(".").join("")
    // console.log(await bcrypt.genSalt(10))
    const haship = await bcrypt.hash(userip, "$2b$10$mTdlWLqvpkkF/eFPV8rKr.")
    const isUser = checkUserPresence(haship)
    if (isUser) {
      // user already liked a stock
      return false
    } else {
      // user has not liked a stock 
      return true
    }
  }

  // ----------------------------------------------------- //
  const likeSymbols = async (symbols) => {
    // like the symbol

  }

  // ----------------------------------------------------- //

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const symbols = req.query.stock
      const like = req.query.like
      let data
      let data2
      let currentUser = req.headers['x-forwarded-for'] || req.socket.remoteAddress
      let stockLikeChance = await checkUser(currentUser)
      console.log(stockLikeChance)

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
        // response for two symbol
        res.send({
          "stockData": [
            { "stock": symbols[0], "price": parseFloat(data["previousClose"]), "rel_likes": 1 },
            { "stock": symbols[1], "price": parseFloat(data2["previousClose"]), "rel_likes": -1 }]
        })

      } else {
        await axios.get(baseUrl + symbols.toUpperCase() + "/quote")
          .then(res => data = res["data"])
        // response for one symbol 
        res.send({
          "stockData": {
            "stock": symbols,
            "price": data["previousClose"],
            "likes": 1
          }
        })
      }
    })
}