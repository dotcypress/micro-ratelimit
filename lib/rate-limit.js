const MemoryStore = require('./memory-store.js')

const DefaultOpts = {
  window: 1000,
  limit: 1,
  keyGenerator: function (req) {
    return req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress
  }
}

function limit (opts, handler) {
  if (!handler) {
    handler = opts
    opts = {}
  }
  const config = Object.assign(DefaultOpts, opts)
  const limitStore = new MemoryStore(config.window)
  return (req, res) => {
    const key = config.keyGenerator(req)
    if (!key) {
      return handler(req, res)
    }
    const remaining = config.limit - limitStore.incr(key)
    if (remaining < 0) {
      const err = new Error('Rate limit exceeded')
      err.statusCode = 429
      throw err
    }
    return handler(req, res)
  }
}

module.exports = limit
