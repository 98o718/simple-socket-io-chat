const socket = io()

const COLORS = [
  '#f44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#795548',
  '#607D8B'
]

const getUsernameColor = username => {
  var hash = 7
  for (var i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + (hash << 5) - hash
  }
  var index = Math.abs(hash % COLORS.length)
  return COLORS[index]
}

const sendMessage = () => {
  const message = document.querySelector('.input-section__input--text')
  const username = document.querySelector('.input-section__input--name')
  message.value !== '' &&
    username.value !== '' &&
    socket.emit('add user', username.value) &&
    socket.emit('chat message', message.value)
  if (username.value !== '' && message.value !== '') username.disabled = true
  message.value = ''
  return false
}

const handleKeyPress = event => {
  event.key === 'Enter' && sendMessage()
}

const newMessage = data => {
  const { message, username } = data
  const item = document.createElement('li')
  const text = document.createElement('span')
  const name = document.createElement('span')
  const list = document.querySelector('.messages-section__list')
  text.innerHTML = message
  name.innerHTML = `${username}:`
  name.className = 'messages-section__name'
  name.style.color = getUsernameColor(username)
  item.appendChild(name)
  item.appendChild(text)
  list.appendChild(item)
  list.parentElement.scrollTop = list.parentElement.scrollHeight
}

const userConnected = username => {
  const item = document.createElement('li')
  const list = document.querySelector('.messages-section__list')
  item.innerHTML = `${username} подключился(-ась)`
  item.style.color = getUsernameColor(username)
  list.appendChild(item)
  list.parentElement.scrollTop = list.parentElement.scrollHeight
}

const userLeft = username => {
  const item = document.createElement('li')
  const list = document.querySelector('.messages-section__list')
  item.innerHTML = `${username} отключился(-ась)`
  item.style.color = getUsernameColor(username)
  list.appendChild(item)
  list.parentElement.scrollTop = list.parentElement.scrollHeight
}

socket.on('chat message', data => {
  newMessage(data)
})

socket.on('user connected', username => {
  userConnected(username)
})

socket.on('user left', username => {
  userLeft(username)
})
