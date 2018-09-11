function InMemoryLock() {
  this.isLocked = false
  this.next = []
}

InMemoryLock.prototype.lock = async function lock(key) {
  return new Promise(resolve => {
    if (!this.isLocked) {
      this.isLocked = true
      resolve()
    } else {
      this.next.push(resolve)
    }
  })
}

InMemoryLock.prototype.unlock = async function unlock(key) {
  this.isLocked = false
  const next = this.next.shift()
  if (next) next()
}

module.exports = InMemoryLock
