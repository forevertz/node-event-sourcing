/* Note: for development environments only */

function InMemoryQueue() {
  this.listeners = {}
}

InMemoryQueue.prototype.publish = function publish(type, event) {
  process.nextTick(() => (this.listeners[type] || []).forEach(callback => callback(event)))
}

InMemoryQueue.prototype.subscribe = function subscribe(type, callback) {
  this.listeners[type] = [...(this.listeners[type] || []), callback]
  return () => this.unsubscribe(type, callback)
}

InMemoryQueue.prototype.unsubscribe = function unsubscribe(type, callback) {
  this.listeners[type] = this.listeners[type].filter(listener => listener !== callback)
  if (this.listeners[type].length === 0) {
    delete this.listeners[type]
  }
}

module.exports = new InMemoryQueue()
