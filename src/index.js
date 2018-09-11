module.exports = {
  // Global
  EventReceiver: require('./EventReceiver'),
  EventArchivist: require('./EventArchivist'),
  EventProcessor: require('./EventProcessor'),
  StateReader: require('./StateReader'),
  // EventStores
  FileSystemEventStore: require('./EventStore/FileSystem'),
  // Queues
  InMemoryQueue: require('./Queue/InMemory'), // not recommended in production
  RedisQueue: require('./Queue/Redis'),
  // StateStores
  InMemoryStateStore: require('./StateStore/InMemory') // not recommended in production
}
