const elasticsearch = require('elasticsearch')
const { EventReceiver, EventArchivist, ElasticsearchEventStore } = require('node-event-sourcing')

const queueName = 'event'
const receiver = new EventReceiver({ queueName })

const elasticsearchClient = new elasticsearch.Client({ host: 'localhost:9200' })
/*
There you can define your settings and indexes:

await elasticsearchClient.indices.putTemplate({
  name: queueName,
  body: {
    index_patterns: [`${queueName}_*`],
    settings: {
      number_of_shards: 5,
      number_of_replicas: 1,
      refresh_interval: '1s'
    },
    mappings: {
      _doc: {
        eventType: { type: 'keyword' },
        eventDate: { type: 'date', format: 'epoch_second' }
        // ...
      }
    }
  }
})
*/
const archivist = new EventArchivist({
  queueName,
  eventStore: new ElasticsearchEventStore(elasticsearchClient)
})
archivist.run()

console.log('Simulating increments')
setInterval(() => receiver.handle({ eventType: 'increment-counter-1' }), 1000)
setInterval(() => receiver.handle({ eventType: 'increment-counter-2' }), 1500)
console.log(`Open "http://localhost:9200/${queueName}_*/_search" to see the stored events.`)
setTimeout(async () => {
  console.log('Saved events:')
  console.log(await archivist.find({ from: new Date(Date.now() - 12000) }, console.log))
  process.exit(0)
}, 11000)
