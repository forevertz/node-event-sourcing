const InMemoryLock = require('../Lock/InMemory')
const RedisQueue = require('../Queue/Redis')

/*
Note: uses in-memory locks => all processors for a given model must run on a single instance.
*/

function RedisStateStore(redisClient) {
  this.client = redisClient
  this.queue = new RedisQueue(redisClient.duplicate())
  this.locks = {}
}

RedisStateStore.prototype.readOnly = async function readOnly(key) {
  return new Promise((resolve, reject) => {
    this.client.get(key, (error, result) => (error ? reject(error) : resolve(JSON.parse(result))))
  })
}

RedisStateStore.prototype.lockAndGet = async function lockAndGet(key) {
  if (!this.locks[key]) {
    this.locks[key] = new InMemoryLock()
  }
  await this.locks[key].lock()
  return this.readOnly(key)
}

RedisStateStore.prototype.set = async function set(key, value) {
  return new Promise((resolve, reject) => {
    this.client.set(
      key,
      JSON.stringify(value),
      (error, result) => (error ? reject(error) : resolve(result))
    )
    this.locks[key].unlock()
    this.queue.publish(key, value)
  })
}

RedisStateStore.prototype.subscribe = function subscribe(key, callback) {
  this.queue.subscribe(key, callback)
  return () => this.unsubscribe(key, callback)
}

RedisStateStore.prototype.unsubscribe = function unsubscribe(key, callback) {
  this.queue.unsubscribe(key, callback)
}

module.exports = RedisStateStore
