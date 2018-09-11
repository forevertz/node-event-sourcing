const {
  EventReceiver,
  EventArchivist,
  EventProcessor,
  RedisStateStore
} = require('node-event-sourcing')
const redis = require('redis')

/*
Note: EventReceiver, EventArchivist, EventProcessor in a single file for demonstration purposes.
*/
const receiver = new EventReceiver()

const archivist = new EventArchivist()
archivist.run()

const processor = new EventProcessor({
  stateStore: new RedisStateStore(redis.createClient('6379'))
})
processor.on('increment-counter-1', async (event, stateStore) => {
  const currentCounter = parseInt(await stateStore.lockAndGet('counter:1')) || 0
  await stateStore.set('counter:1', currentCounter + 1)
})
processor.on('increment-counter-2', async (event, stateStore) => {
  const currentCounter = parseInt(await stateStore.lockAndGet('counter:2')) || 0
  await stateStore.set('counter:2', currentCounter + 1)
})

// Simulate increments every second
setInterval(() => receiver.handle({ eventType: 'increment-counter-1' }), 1000)
setInterval(() => receiver.handle({ eventType: 'increment-counter-2' }), 1500)
setTimeout(() => process.exit(0), 11000)
