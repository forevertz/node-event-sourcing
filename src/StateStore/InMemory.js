const InMemoryLock = require('../Lock/InMemory')
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
    this.locks[key] = new InMemoryLock()
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

module.exports = new InMemoryStateStore()
