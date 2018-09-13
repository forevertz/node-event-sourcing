function KafkaQueue({ producer, consumer }) {
  this.producer = producer
  this.consumer = consumer
  this.listeners = {}

  if (this.consumer) {
    this.consumer.on('message', ({ topic, value }) =>
      (this.listeners[topic] || []).forEach(callback => callback(JSON.parse(value), topic))
    )
  }
}

KafkaQueue.prototype.publish = function publish(type, event) {
  if (this.producer) {
    this.producer.send([{ topic: type, messages: JSON.stringify(event) }], () => {})
  }
}

KafkaQueue.prototype.subscribe = function subscribe(type, callback) {
  if (!this.listeners[type] && this.consumer) {
    this.consumer.addTopics([type], () => {})
  }
  this.listeners[type] = [...(this.listeners[type] || []), callback]
  return () => this.unsubscribe(type, callback)
}

KafkaQueue.prototype.unsubscribe = function unsubscribe(type, callback) {
  this.listeners[type] = this.listeners[type].filter(listener => listener !== callback)
  if (this.listeners[type].length === 0) {
    delete this.listeners[type]
    if (this.consumer) this.consumer.removeTopics([type], () => {})
  }
}

module.exports = KafkaQueue
