var clusterGet = require('level-cluster-get')

  , clusterConsistency = function (db, config) {
      var get = clusterGet(db, config)
        , consistency = function (key, callback) {
            get(key, function (err, data) {
              if (err) return callback(err)

              var values = Object.keys(data).map(function (key) {
                    return data[key].value
                  })
                , value = values.pop()

              callback(
                  null
                , values.every(function (row) {
                    return row === value
                  })
              )
            })
          }

      consistency.close = get.close.bind(get)
      return consistency
    }

module.exports = clusterConsistency
