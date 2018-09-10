const queue = require('../Queue/InMemory')

/* Note: for development environments only */

function InMemoryStateStore() {
  this.data = {}
  this.locks = {}
}

InMemoryStateStore.prototype.readOnly = async function readOnly(key) {
  return this.data[key]
}

InMemoryStateStore.prototype.lockAndGet = async function lockAndGet(key) {
  if (!this.locks[key]) {
    this.locks[key] = new Lock()
  }
  await this.locks[key].lock()
  return this.data[key]
}

InMemoryStateStore.prototype.set = async function set(key, value) {
  this.data[key] = value
  this.locks[key].unlock()
  queue.publish(`${key}-changed`, value)
}

InMemoryStateStore.prototype.subscribe = function subscribe(key, callback) {
  queue.subscribe(`${key}-changed`, callback)
  return () => this.unsubscribe(key, callback)
}

InMemoryStateStore.prototype.unsubscribe = function unsubscribe(key, callback) {
  queue.unsubscribe(`${key}-changed`, callback)
}

function Lock() {
  this.isLocked = false
  this.next = []
  return {
    lock: () => {
      return new Promise(resolve => {
        if (!this.isLocked) {
          this.isLocked = true
          resolve()
        } else {
          this.next.push(resolve)
        }
      })
    },
    unlock: () => {
      this.isLocked = false
      const next = this.next.shift()
      if (next) next()
    }
  }
}

module.exports = new InMemoryStateStore()
