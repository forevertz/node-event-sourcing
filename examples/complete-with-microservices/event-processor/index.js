const kafka = require('kafka-node')
const { EventProcessor, KafkaQueue, RedisStateStore } = require('node-event-sourcing')
const redis = require('redis')

const kafkaConfig = { host: 'zookeeper:2181', kafkaHost: 'kafka:9092' }
const processor = new EventProcessor({
  queue: new KafkaQueue({
    producer: new kafka.Producer(new kafka.KafkaClient(kafkaConfig)),
    consumer: new kafka.ConsumerGroup({ ...kafkaConfig, groupId: 'ProcessorGroup' }, ['event'])
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
