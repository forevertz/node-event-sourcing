function EventReceiver({ queue, queueName } = {}) {
  this.queue = queue || require('./Queue/InMemory')
  this.queueName = queueName || 'event'

  if (this.queue.constructor.name === 'InMemoryQueue' && process.env.NODE_ENV !== 'development') {
    console.warn('[WARN] EventReceiver: using in-memory queue is not recommended in production.')
  }
}

EventReceiver.prototype.emit = function emit(event) {
  if (!event.eventDate) event.eventDate = new Date().getTime()
  this.queue.publish(this.queueName, event)
}

module.exports = EventReceiver
