const micro = require('micro')
const { StateReader, RedisStateStore } = require('node-event-sourcing')
const redis = require('redis')
const staticHandler = require('serve-handler')
const socketIo = require('socket.io')

const state = new StateReader({
  stateStore: new RedisStateStore(redis.createClient('//redis:6379'))
})

const server = micro(async (req, res) => {
  const pathname = req.url.split('?')[0]
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', ['Content-Type'].join(', '))

  if (req.method === 'OPTIONS') {
    return ''
  } else if (pathname === '/counter') {
    const { id } = parseQueryString(req.url)
    return { success: true, result: await state.get(`counter:${id}`) }
  }

  return staticHandler(req, res, { public: 'static' })
})

const io = socketIo(server)
io.origins(['*:*'])
io.on('connection', socket => {
  const subscriptions = []
  socket.on('subscribe', async key => {
    socket.emit('change', { key, value: await state.get(key) })
    subscriptions.push(state.subscribe(key, value => socket.emit('change', { key, value })))
  })
  socket.on('disconnect', () => {
    subscriptions.forEach(unsubscribe => unsubscribe())
  })
})

function parseQueryString(url) {
  return (url.split('?')[1] || '').split('&').reduce(
    (params, paramString) => ({
      ...params,
      [paramString.split('=')[0]]: paramString
        .split('=')
        .slice(1)
        .join('')
    }),
    {}
  )
}

server.listen(process.env.PORT || 3000)
