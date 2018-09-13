const elasticsearch = require('elasticsearch')
const { EventArchivist, KafkaQueue, ElasticsearchEventStore } = require('node-event-sourcing')
const kafka = require('kafka-node')

const elasticsearchClient = new elasticsearch.Client({ host: 'elasticsearch:9200' })

async function configureElasticsearch() {
  try {
    await elasticsearchClient.ping()
    await elasticsearchClient.indices.putTemplate({
      name: 'event',
      body: {
        index_patterns: ['event_*'],
        settings: {
          number_of_shards: 5,
          number_of_replicas: 1,
          refresh_interval: '1s'
        },
        mappings: {
          _doc: {
            eventType: { type: 'keyword' },
            eventDate: { type: 'date', format: 'epoch_second' }
          }
        }
      }
    })
  } catch (error) {
    setTimeout(configureElasticsearch, 2000)
  }
}
configureElasticsearch()

const kafkaConfig = { host: 'zookeeper:2181', kafkaHost: 'kafka:9092' }
const archivist = new EventArchivist({
  queue: new KafkaQueue({
    consumer: new kafka.ConsumerGroup({ ...kafkaConfig, groupId: 'ArchivistGroup' }, ['event'])
  }),
  eventStore: new ElasticsearchEventStore(elasticsearchClient)
})
archivist.run()
