class MemoryStore {
  constructor (clearPeriod) {
    this.hits = new Map()
    setInterval(this.reset.bind(this), clearPeriod)
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
