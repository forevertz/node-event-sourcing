function RedisQueue(redisClient) {
  this.publisher = redisClient
  this.subscriber = redisClient.duplicate()
  this.listeners = {}

  this.subscriber.on('message', (channel, message) =>
    (this.listeners[channel] || []).forEach(callback => callback(JSON.parse(message), channel))
  )
}

RedisQueue.prototype.publish = function publish(type, event) {
  this.publisher.publish(type, JSON.stringify(event))
}

RedisQueue.prototype.subscribe = function subscribe(type, callback) {
  if (!this.listeners[type]) {
    this.subscriber.subscribe(type)
  }
  this.listeners[type] = [...(this.listeners[type] || []), callback]
  return () => this.unsubscribe(type, callback)
}

RedisQueue.prototype.unsubscribe = function unsubscribe(type, callback) {
  this.listeners[type] = this.listeners[type].filter(listener => listener !== callback)
  if (this.listeners[type].length === 0) {
    delete this.listeners[type]
    this.subscriber.unsubscribe(type)
  }
}

module.exports = RedisQueue
