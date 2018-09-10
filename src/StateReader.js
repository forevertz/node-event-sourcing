function StateReader(stateStore) {
  this.stateStore = stateStore || require('./StateStore/InMemory')

  if (
    this.stateStore.constructor.name === 'InMemoryStateStore' &&
    process.env.NODE_ENV !== 'development'
  ) {
    console.warn(
      '[WARN] StateReader: using in-memory state store is not recommended in production.'
    )
  }
}

StateReader.prototype.get = async function get(key) {
  return this.stateStore.readOnly(key)
}

StateReader.prototype.subscribe = function subscribe(key, callback) {
  this.stateStore.subscribe(key, callback)
  return () => this.unsubscribe(key, callback)
}

StateReader.prototype.unsubscribe = function unsubscribe(key, callback) {
  this.stateStore.unsubscribe(key, callback)
}

module.exports = StateReader
