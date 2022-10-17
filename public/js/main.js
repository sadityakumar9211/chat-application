const chatForm = document.getElementById('chat-form')
const roomName = document.querySelector('#room-name')
const userList = document.querySelector('#users')
//get username and room from URL
const {username, room } = Qs.parse(window.location.search, {
    ignoreQueryPrefix: true
})

const socket = io()

//Join chatroom
socket.emit('joinRoom', {username, room})

//Get room and users
socket.on('roomUsers', ({room, users})=> {
    outputRoomName(room)
    outputUsers(users)
})

const chatMessages = document.querySelector('.chat-messages')
//Message from server
socket.on('message', (message) => {
    console.log(message)
    outputMessage(message)
    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight

})




//Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault() //stopping the reloading
    const messageText = e.target.elements.msg.value //getting the value of message field by id
    // console.log(messageText)
    //emitting a message to the server from the client-side
    socket.emit('chatMessage', messageText)
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()   //focusing on it.
    
})

//output message to DOM
function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`

    document.querySelector('.chat-messages').appendChild(div)
}


//Add room name to DOM
function outputRoomName(room) {
    roomName.textContent = room
}

function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}`
}