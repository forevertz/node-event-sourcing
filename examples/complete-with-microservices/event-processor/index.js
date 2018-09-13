const kafka = require('kafka-node')
const { EventProcessor, KafkaQueue, RedisStateStore } = require('node-event-sourcing')
const redis = require('redis')

const kafkaClient = new kafka.Client('zookeeper:2181')
const processor = new EventProcessor({
  queue: new KafkaQueue({
    producer: new kafka.Producer(kafkaClient),
    consumer: new kafka.Consumer(kafkaClient, [{ topic: 'event' }])
  }),
  stateStore: new RedisStateStore(redis.createClient('//redis:6379'))
})

processor.on('increment-counter-1', async (event, stateStore) => {
  const currentCounter = parseInt(await stateStore.lockAndGet('counter:1')) || 0
  await stateStore.set('counter:1', currentCounter + 1)
})

processor.on('increment-counter-2', async (event, stateStore) => {
  const currentCounter = parseInt(await stateStore.lockAndGet('counter:2')) || 0
  await stateStore.set('counter:2', currentCounter + 1)
})
