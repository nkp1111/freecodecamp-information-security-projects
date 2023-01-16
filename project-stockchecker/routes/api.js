'use strict';
let axios = require("axios")
const bcrypt = require("bcrypt")

let baseUrl = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/"
let { checkUserPresence, getSymbolLike } = require("./likeDb")

module.exports = function (app) {

  // ----------------------------------------------------- //
  const checkUser = async (user) => {
    // check current user presence in database
    let userip = user.split(":").slice(-1,)[0].split(".").join("")
    // console.log(await bcrypt.genSalt(10))
    const haship = await bcrypt.hash(userip, "$2b$10$mTdlWLqvpkkF/eFPV8rKr.")
    const isUser = await checkUserPresence(haship)
    if (isUser) {
      // user already liked a stock
      return false
    } else {
      // user has not liked a stock 
      return true
    }
  }

  // ----------------------------------------------------- //

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const symbols = req.query.stock
      const like = req.query.like

      let stockLikeChance
      let data, like1
      let data2, like2

      let currentUser = req.headers['x-forwarded-for'] || req.socket.remoteAddress

      if (like) {
        stockLikeChance = await checkUser(currentUser)
      }

      // for two symbols
      if (Array.isArray(symbols)) {
        for (let s of symbols) {
          let curSymbol = s.toUpperCase()
          await axios.get(baseUrl + curSymbol + "/quote")
            .then(async res => {
              if (!data) {
                data = res["data"]
                like1 = await getSymbolLike(curSymbol, stockLikeChance)
              } else {
                data2 = res["data"]
                like2 = await getSymbolLike(curSymbol, stockLikeChance)
              }
            })
        }
        // response for two symbol
        res.send({
          "stockData": [
            { "stock": symbols[0], "price": parseFloat(data["previousClose"]), "rel_likes": like1 },
            { "stock": symbols[1], "price": parseFloat(data2["previousClose"]), "rel_likes": like2 }]
        })

      } else {
        // for one symbol 
        await axios.get(baseUrl + symbols.toUpperCase() + "/quote")
          .then(res => data = res["data"])

        like1 = await getSymbolLike(symbols.toUpperCase(), stockLikeChance)

        // response for one symbol 
        res.send({
          "stockData": {
            "stock": symbols,
            "price": data["previousClose"],
            "likes": like1
          }
        })
      }
    })
}