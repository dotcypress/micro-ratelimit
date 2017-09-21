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
  const config = Object.assign({}, DefaultOpts, opts)
  const limitStore = new MemoryStore(config.window)
  const reset = Math.ceil(config.window / 1000)
  return (req, res) => {
    const key = config.keyGenerator(req)
    if (!key) {
      return handler(req, res)
    }
    const remaining = config.limit - limitStore.incr(key)
    if (config.headers && !res.finished && !res.headersSent) {
      res.setHeader('X-Rate-Limit-Limit', config.limit)
      res.setHeader('X-Rate-Limit-Remaining', Math.max(0, remaining))
      res.setHeader('X-Rate-Limit-Reset', reset)
    }
    if (remaining < 0) {
      const err = new Error('Rate limit exceeded')
      err.statusCode = 429
      throw err
    }
    return handler(req, res)
  }
}

module.exports = limit
