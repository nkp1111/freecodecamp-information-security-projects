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

        if (!checkUser(currentUser)) {
          console.log("liking it ")
          likeSymbols(symbols)
        }
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
        res.send(
          {
            "stockData": {
              "stock": symbols,
              "price": data["previousClose"],
              "likes": 1
            }
          }
        )
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
  // check if current user have already liked or not 
  User.find().then(async data => {
    let userip = user.split(":").slice(-1,)[0].split(".").join("")
    // console.log(await bcrypt.genSalt(10))
    let hashedip = await bcrypt.hash(user, "$2b$10$mTdlWLqvpkkF/eFPV8rKr.")
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

function likeSymbols(symbols) {
  // like the symbol
  Like.find().then(data => {
    // get all likes
    let likes = data
    if (Array.isArray(symbols)) {
      // if symbols is an array check each symbol
      for (let s of symbols) {
        let symbolUpdated = false
        for (let l of likes) {
          if (l.title == s) {
            symbolUpdated = true
            let currentLikes = l.like + 1
            l.like = currentLikes
            l.save()
          }
        }
        // if symbol is not present in database add it
        if (!symbolUpdated) {
          let newone = new Like(
            { title: s, like: 1 }
          )
          newone.save()
        }
      }
    }
    else {
      // if symbols is not an array check the symbol
      let symbolUpdated = false
      Like.find().then(data => {
        for (let l of data) {
          if (l.title == symbols) {
            symbolUpdated = true
            let currentLikes = l.like + 1
            l.like = currentLikes
            l.save()
          }
        }
      })
      if (!symbolUpdated) {
        const newone = Like({ title: symbols, like: 1 })
        newone.save()
      }
    }

  })

}