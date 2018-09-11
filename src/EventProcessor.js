function EventProcessor({ queue, queueName, stateStore, eventTypeKey } = {}) {
  this.queue = queue || require('./Queue/InMemory')
  this.queueName = queueName || 'event'
  this.stateStore = stateStore || require('./StateStore/InMemory')
  this.eventTypeKey = eventTypeKey || 'eventType'

  if (this.queue.constructor.name === 'InMemoryQueue' && process.env.NODE_ENV !== 'development') {
    console.warn('[WARN] EventProcessor: using in-memory queue is not recommended in production.')
  }
}

EventProcessor.prototype.on = function on(eventType, processEvent) {
  return this.queue.subscribe(this.queueName, event => {
    if (event[this.eventTypeKey] === eventType) {
      processEvent(event, this.stateStore, this.queue)
    }
  })
}

module.exports = EventProcessor
