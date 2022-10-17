const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

//Set public directory as static directory
//__dirname is the gives the absolute path of directory containing the currently executing file.
//path.join() method joins all given path segments together using the platform-specific separator as a delimiter, then normalizes the resulting path.
app.use(express.static(path.join(__dirname, 'public')))
const botName = 'Bot'
//Run when a client connects
io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)
        //Welcome current user - only to that specific user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'))
        //Broadcast when a user connects - all except the current joined user
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(botName, `${user.username} has joined the chat`)
            )
    
        //Send users and room info
        io.to(user.room).emit(`roomUsers`, {
            room: user.room,
            users: getRoomUsers(user.room)
        })
        //Listening for chat message
        socket.on('chatMessage', (messageText) => {
        io.to(user.room).emit('message', formatMessage( user.username, messageText))
    })
    })

    //io.emit() - emits to all connected users including the current user

    

    //runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        if(user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`))
            //Send users and room info
            io.to(user.room).emit(`roomUsers`, {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }    
    })


})

const port = 3000 || process.env.PORT

server.listen(port, () => {
    console.log('Server is running on port ' + port)
})
