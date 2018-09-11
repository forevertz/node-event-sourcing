const {
  EventReceiver,
  EventArchivist,
  EventProcessor,
  StateReader
} = require('node-event-sourcing')

const receiver = new EventReceiver()

const archivist = new EventArchivist()
archivist.run()

const processor = new EventProcessor()
processor.on('increment-counter', async (event, stateStore) => {
  const currentCounter = (await stateStore.lockAndGet('counter')) || 0
  await stateStore.set('counter', currentCounter + 1)
})

const state = new StateReader()

console.log('Simulating increments every second')
setInterval(() => receiver.handle({ eventType: 'increment-counter' }), 1000)
setInterval(
  async () => console.log('Reading current counter value:', await state.get('counter')),
  5000
)
console.log('Subscribing to counter state change')
const unsubscribe = state.subscribe('counter', value => console.log('Counter changed:', value))
setTimeout(() => {
  console.log('Unsubscribing state change')
  unsubscribe()
}, 6000)
setTimeout(() => {
  console.log('Stopping')
  process.exit(0)
}, 11000)
