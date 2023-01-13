'use strict';
let axios = require("axios")
let symbols
let baseUrl = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/"
let data
let data2

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      symbols = req.query.stock
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
              "rel_likes": 1
            }
          }
        )
      } else {
        // response for two symbol 
        res.send({
          "stockData": [
            { "stock": symbols[0], "price": data["previousClose"], "rel_likes": 1 },
            { "stock": symbols[1], "price": data["previousClose"], "rel_likes": 1 }]
        })
      }
    });

};
