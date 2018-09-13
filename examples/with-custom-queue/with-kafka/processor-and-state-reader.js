const { EventProcessor, StateReader, KafkaQueue } = require('node-event-sourcing')
const kafka = require('kafka-node')

/*
Note: EventProcessor and StateReader in a single file for demonstration purposes.
*/
const processor = new EventProcessor({
  queue: new KafkaQueue({
    producer: new kafka.Producer(new kafka.KafkaClient()),
    consumer: new kafka.ConsumerGroup({ groupId: 'ProcessorGroup' }, ['event'])
  })
})
processor.on('increment-counter-1', async (event, stateStore) => {
  const currentCounter = parseInt(await stateStore.lockAndGet('counter:1')) || 0
  await stateStore.set('counter:1', currentCounter + 1)
})
processor.on('increment-counter-2', async (event, stateStore) => {
  const currentCounter = parseInt(await stateStore.lockAndGet('counter:2')) || 0
  await stateStore.set('counter:2', currentCounter + 1)
})

const state = new StateReader()

setInterval(
  async () =>
    console.log('Reading current counter values:', {
      'counter:1': await state.get('counter:1'),
      'counter:2': await state.get('counter:2')
    }),
  5000
)
console.log('Subscribing to counter state change')
const unsubscribe1 = state.subscribe('counter:1', value => console.log('Counter 1 changed:', value))
const unsubscribe2 = state.subscribe('counter:2', value => console.log('Counter 2 changed:', value))
setTimeout(() => {
  console.log('Unsubscribing state change')
  unsubscribe1()
  unsubscribe2()
}, 6000)
setTimeout(() => {
  console.log('Stopping')
  process.exit(0)
}, 11000)
