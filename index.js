const fastify = require('fastify')()
const path = require('path')
const io = require('socket.io')(fastify.server)

const { HOST, PORT } = require('./config')

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/'
})

fastify.get('/', async (request, reply) => {
  reply.type('text/html').code(200)
  reply.sendFile('index.html')
})

io.on('connection', socket => {
  let addedUser = false

  socket.on('add user', username => {
    if (addedUser) return

    socket.username = username

    io.emit('user connected', username)

    addedUser = true
  })

  socket.on('disconnect', () => {
    if (addedUser) {
      io.emit('user left', socket.username)
    }
  })

  socket.on('chat message', message => {
    io.emit('chat message', { message, username: socket.username })
  })
})

fastify.listen(PORT, HOST, (err, address) => {
  if (err) throw err
  console.log(`🚀 Listening on ${address}`)
})
