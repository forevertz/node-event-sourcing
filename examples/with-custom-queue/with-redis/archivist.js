const { EventArchivist, RedisQueue } = require('node-event-sourcing')
const redis = require('redis')

const archivist = new EventArchivist({
  queue: new RedisQueue(redis.createClient('6379'))
})
archivist.run()
