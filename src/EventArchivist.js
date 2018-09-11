function EventArchivist({ queue, queueName, eventStore } = {}) {
  this.queue = queue || require('./Queue/InMemory')
  this.queueName = queueName || 'event'
  this.eventStore = eventStore || require('./EventStore/FileSystem')(this.queueName)

  if (this.queue.constructor.name === 'InMemoryQueue' && process.env.NODE_ENV !== 'development') {
    console.warn('[WARN] EventArchivist: using in-memory queue is not recommended in production.')
  }
}

EventArchivist.prototype.run = function run() {
  this.queue.subscribe(this.queueName, event => this.eventStore.store(event, this.queueName))
}

EventArchivist.prototype.find = function find({ from }, treatChunk) {
  return this.eventStore.find(this.queueName, { from }, treatChunk)
}

module.exports = EventArchivist
