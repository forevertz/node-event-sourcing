const kafka = require('kafka-node')
const { json } = require('micro')
const { EventReceiver, KafkaQueue } = require('node-event-sourcing')

const kafkaConfig = { host: 'zookeeper:2181', kafkaHost: 'kafka:9092' }
const receiver = new EventReceiver({
  queue: new KafkaQueue({ producer: new kafka.Producer(new kafka.KafkaClient(kafkaConfig)) })
})

module.exports = async (req, res) => {
  const pathname = req.url.split('?')[0]
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', ['Content-Type'].join(', '))

  if (req.method === 'OPTIONS') {
    return ''
  } else if (req.method === 'POST' && pathname === '/event') {
    const event = await json(req, { encoding: 'utf8' })
    receiver.emit(event)
    return { success: true }
  } else {
    return 'Welcome! Please POST on /event to add an event.'
  }
}
