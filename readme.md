[![Build Status](https://img.shields.io/travis/dotcypress/micro-ratelimit.svg?branch=master&style=flat-square)](https://travis-ci.org/dotcypress/micro-ratelimit)
[![NPM Version](https://img.shields.io/npm/v/micro-ratelimit.svg?style=flat-square)](https://www.npmjs.com/package/micro-ratelimit)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

# Micro Rate Limit

Rate-limiting middleware for [micro](https://github.com/zeit/micro).

## Installation

```js
$ npm install micro-ratelimit
```

## Examples
  
```js
const rateLimit = require('micro-ratelimit')

module.exports = rateLimit((req, res) => {
  return 'Hello world'
})

```

```js
const rateLimit = require('micro-ratelimit')

// Limit example: 2 requests per 10 sec
module.exports = rateLimit({window: 10000, limit: 2}, (req, res) => {
  return 'Hello world'
})

```

## API

### Options

* `window`: how long to keep records of requests in memory in ms (default: 1 second)
* `limit`: max number of requests during window (default: 1)
* `keyGenerator`: key generator function (req -> client id)

Default implementation of `keyGenerator`:

```js
function keyGenerator (req) {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
}
```
