function ElasticsearchEventStore(elasticsearchClient) {
  this.client = elasticsearchClient
}

ElasticsearchEventStore.prototype.store = async function store(data, domain) {
  const date = new Date(data.eventDate).toISOString().substr(0, 10)
  await this.client.index({ index: `${domain}_${date}`, type: domain, body: data })
}

ElasticsearchEventStore.prototype.find = async function find(domain, { from }, treatChunk) {
  try {
    const query = {
      index: `${domain}_*`,
      scroll: '30s',
      body: {
        query: {
          bool: {
            filter: [{ range: { eventDate: { gte: from ? from.getTime() : 0 } } }]
          }
        },
        sort: { eventDate: 'asc' },
        size: 1000
      }
    }
    let totalSent = 0
    let response = await this.client.search(query)
    while (response) {
      totalSent += response.hits.hits.length
      treatChunk(response.hits.hits.map(({ _source }) => _source))
      response =
        totalSent < response.hits.total &&
        (await this.client.scroll({ scrollId: response._scroll_id, scroll: query.scroll }))
    }
    return totalSent
  } catch (error) {
    console.error(error)
  }
}

module.exports = ElasticsearchEventStore
