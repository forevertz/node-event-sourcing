const { EventReceiver, KafkaQueue } = require('node-event-sourcing')
const kafka = require('kafka-node')

const receiver = new EventReceiver({
  queue: new KafkaQueue({ producer: new kafka.Producer(new kafka.Client()) })
})

console.log('Simulating increments')
setInterval(() => receiver.handle({ eventType: 'increment-counter-1' }), 1000)
setInterval(() => receiver.handle({ eventType: 'increment-counter-2' }), 1500)
setTimeout(() => process.exit(0), 11000)
