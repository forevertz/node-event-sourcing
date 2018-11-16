function EventArchivist({ queue, queueName, eventStore, transform } = {}) {
  this.queue = queue || require('./Queue/InMemory')
  this.queueName = queueName || 'event'
  this.eventStore = eventStore || new (require('./EventStore/FileSystem'))(this.queueName)
  this.transform = transform || (v => v)

  if (this.queue.constructor.name === 'InMemoryQueue' && process.env.NODE_ENV !== 'development') {
    console.warn('[WARN] EventArchivist: using in-memory queue is not recommended in production.')
  }
}

EventArchivist.prototype.run = function run() {
  this.queue.subscribe(this.queueName, event =>
    this.eventStore.store(this.transform(event), this.queueName)
  )
}

EventArchivist.prototype.find = function find({ from }, treatChunk) {
  return this.eventStore.find(this.queueName, { from }, treatChunk)
}

module.exports = EventArchivist
