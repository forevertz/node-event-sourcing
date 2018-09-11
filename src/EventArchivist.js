function EventArchivist({ queue, eventStore } = {}) {
  this.queue = queue || require('./Queue/InMemory')
  this.eventStore = eventStore || require('./EventStore/FileSystem')

  if (this.queue.constructor.name === 'InMemoryQueue' && process.env.NODE_ENV !== 'development') {
    console.warn('[WARN] EventArchivist: using in-memory queue is not recommended in production.')
  }
}

EventArchivist.prototype.run = function run() {
  this.queue.subscribe(process.env.QUEUE_NAME || 'event', event => this.eventStore.store(event))
}

module.exports = EventArchivist
