function EventReceiver({ queue } = {}) {
  this.queue = queue || require('./Queue/InMemory')

  if (this.queue.constructor.name === 'InMemoryQueue' && process.env.NODE_ENV !== 'development') {
    console.warn('[WARN] EventReceiver: using in-memory queue is not recommended in production.')
  }
}

EventReceiver.prototype.handle = function handle(event) {
  this.queue.publish(process.env.QUEUE_NAME || 'event', event)
}

module.exports = EventReceiver
