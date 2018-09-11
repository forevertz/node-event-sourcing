function EventProcessor({ queue, stateStore } = {}) {
  this.queue = queue || require('./Queue/InMemory')
  this.stateStore = stateStore || require('./StateStore/InMemory')

  if (this.queue.constructor.name === 'InMemoryQueue' && process.env.NODE_ENV !== 'development') {
    console.warn('[WARN] EventProcessor: using in-memory queue is not recommended in production.')
  }
}

EventProcessor.prototype.on = function on(eventType, processEvent) {
  return this.queue.subscribe(process.env.QUEUE_NAME || 'event', event => {
    if (event.eventType === eventType) {
      processEvent(event, this.stateStore, this.queue)
    }
  })
}

module.exports = EventProcessor
