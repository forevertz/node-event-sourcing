# Node event-sourcing

A library for Event Sourcing in Node.js.

<a href="https://www.npmjs.com/package/node-event-sourcing"><img alt="npm-status" src="https://img.shields.io/npm/v/node-event-sourcing.svg?style=flat" /></a>
<a href="https://github.com/forevertz/node-event-sourcing/blob/master/LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT_License-blue.svg?style=flat" /></a>

## Architecture

### Components

![Components](https://raw.githubusercontent.com/forevertz/node-event-sourcing/master/docs/images/components.png)

- **Event Receiver** — Entrypoint for all your events. You can call it from a microservice, it will publish the events to your `Queue` service.

- **Event Archivist** — Subscribes to the event `Queue` and stores them in your `Event Store`.

- **Event Processor** — Subscribes to the event `Queue`, apply the event to the current state, and then saves it to the `State Store`.

- **State Reader** — Connects to the `State Store` to get or subscribe to state changes. You can expose it through a microservice.

### Services

![Services](https://raw.githubusercontent.com/forevertz/node-event-sourcing/master/docs/images/services.png)

- **Queue** — Use your own `Queue` implementing `publish(type, event)`, `subscribe(type, callback)`, and `unsubscribe(type, callback)` or use one of the available services : `Kafka` or `Redis`. By default the events with be queued in memory.

- **Event Store** — Use your own `Event Store` implementing `async store(data, domain)`, and `async find(domain, { from }, treatChunk)` or use one of the available services : `Elasticsearch` or `FileSystem`. By default the events with be stored on the file system.

- **State Store** — Use your own `State Store` implementing `async readOnly(key)`, `async lockAndGet(key)`, `async set(key, value)`, `subscribe(key, callback)`, and `unsubscribe(key, callback))` or use one of the available services : `Redis`. By default the states with be stored in memory.

## Getting Started

```shell
$ npm install node-event-sourcing
```

For more details: [see examples](https://github.com/forevertz/node-event-sourcing/blob/master/examples).

```javascript
// receiver.js
import { EventReceiver } from 'node-event-sourcing'

const receiver = new EventReceiver({
  queue: ..., // optional, default: InMemoryQueue (not recommended in production)
  queueName: ... // optional, default: 'event'
})

const event = { eventType: 'increment-counter-1' }
receiver.emit(event)
```

```javascript
// archivist.js
import { EventArchivist } from 'node-event-sourcing'

const archivist = new EventArchivist({
  queue: ..., // optional, default: InMemoryQueue (not recommended in production)
  queueName: ..., // optional, default: 'event'
  eventStore: ..., // optional, default: FileSystemEventStore
  transform: ..., // optional, default: identity function
})
archivist.run()
```

```javascript
// processor.js
import { EventProcessor } from 'node-event-sourcing'

const processor = new EventProcessor({
  queue: ..., // optional, default: InMemoryQueue (not recommended in production)
  queueName: ..., // optional, default: 'event'
  stateStore: ..., // optional, default: InMemoryStateStore (not recommended in production)
  eventTypeKey // optional, default: 'eventType'
})

processor.on('increment-counter-1', async (event, stateStore) => {
  const currentCounter = parseInt(await stateStore.lockAndGet('counter:1')) || 0
  await stateStore.set('counter:1', currentCounter + 1)
})
processor.on('increment-counter-2', async (event, stateStore) => {
  const currentCounter = parseInt(await stateStore.lockAndGet('counter:2')) || 0
  await stateStore.set('counter:2', currentCounter + 1)
})
```

```javascript
// state-reader.js
import { StateReader } from 'node-event-sourcing'

const state = new StateReader({
  stateStore: ... // optional, default: InMemoryStateStore (not recommended in production)
})

state.get('counter:1').then(counter1 => console.log(counter1))
// AND/OR
state.subscribe('counter:1', counter1 => console.log(counter1))
```
