var level = require('level-test')()
  , clusterConsistency = require('./cluster-consistency')

  // server 1
  , config1 = {
        servers: [
            '127.0.0.1:8001'
          , '127.0.0.1:8002'
        ]
      , port: 8000
    }
  , db1 = level('server1')
  , consistency1 = clusterConsistency(db1, config1)

  // server 2
  , config2 = {
        servers: [
            '127.0.0.1:8000'
          , '127.0.0.1:8002'
        ]
      , port: 8001
    }
  , db2 = level('server2')
  , consistency2 = clusterConsistency(db2, config2)

  // server 3
  , config3 = {
        servers: [
            '127.0.0.1:8000'
          , '127.0.0.1:8001'
        ]
      , port: 8002
    }
  , db3 = level('server3')
  , consistency3 = clusterConsistency(db3, config3)

db1.batch([
    { type: 'put', key: 'foo', value: 'bar' }
  , { type: 'put', key: 'hello', value: 'world' }
], function () {
  db2.batch([
      { type: 'put', key: 'foo', value: 'bar' }
    , { type: 'put', key: 'hello', value: 'world' }
  ], function () {
    db3.batch([
        { type: 'put', key: 'foo', value: 'bas' }
      , { type: 'put', key: 'hello', value: 'world' }
    ], function () {
      consistency1('foo', function (err, isConsistent) {
        console.log('Are the values of foo consistent?', isConsistent)
        consistency2('hello', function (err, isConsistent) {
          console.log('Are the values of hello consistent?', isConsistent)
          consistency1.close()
          consistency2.close()
          consistency3.close()
        })
      })
    })
  })
})
