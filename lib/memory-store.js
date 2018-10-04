class MemoryStore {
  constructor (clearPeriod) {
    this.hits = new Map()
    let interval = setInterval(this.reset.bind(this), clearPeriod)
    const shutdown = () => clearInterval(interval)
    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
    process.on('exit', shutdown)
  }

  incr (key) {
    var counter = this.hits.get(key) || 0
    counter++
    this.hits.set(key, counter)
    return counter
  }

  reset () {
    this.hits.clear()
  }
}

module.exports = MemoryStore
