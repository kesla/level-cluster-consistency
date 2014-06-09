# level-cluster-consistency

Given a key, figure out if a cluster of level-instances are consistent

[![NPM](https://nodei.co/npm/level-cluster-consistency.png?downloads&stars)](https://nodei.co/npm/level-cluster-consistency/)

[![NPM](https://nodei.co/npm-dl/level-cluster-consistency.png)](https://nodei.co/npm/level-cluster-consistency/)

## Installation

```
npm install level-cluster-consistency
```

## Example

### Input

```javascript
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
```

### Output

```
Are the values of foo consistent? false
Are the values of hello consistent? true
```

## Licence

Copyright (c) 2014 David Björklund

This software is released under the MIT license:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
