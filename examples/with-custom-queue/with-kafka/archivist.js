const { EventArchivist, KafkaQueue } = require('node-event-sourcing')
const kafka = require('kafka-node')

const archivist = new EventArchivist({
  queue: new KafkaQueue({
    consumer: new kafka.ConsumerGroup({ groupId: 'ArchivistGroup' }, ['event'])
  })
})
archivist.run()
