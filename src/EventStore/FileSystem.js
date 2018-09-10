const rotatingFileStream = require('rotating-file-stream')

/* Note: for development environments only */

function FileSystemEventStore() {
  this.writer = rotatingFileStream('events.log', {
    path: 'data',
    size: '10M',
    interval: '1d',
    compress: 'gzip'
  })
}

FileSystemEventStore.prototype.store = async function store(data) {
  const dataString = typeof data === 'string' ? data : JSON.stringify(data)
  this.writer.write(`${new Date().toISOString()} ${dataString}\n`)
}

FileSystemEventStore.prototype.find = async function find(where) {
  throw new Error('not yet implemented')
}

module.exports = new FileSystemEventStore()
