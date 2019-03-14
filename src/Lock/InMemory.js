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
  const next = this.next.shift()
  if (next) {
    next()
  } else {
    this.isLocked = false
  }
}

module.exports = InMemoryLock
