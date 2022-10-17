/*
- We can have an array of rooms objects, each room object will have a name and an array of users in that room.
- each user will be an object with id, username and room.
*/

const users = []

//Join user to chat
function userJoin( id, username, room ) {
    const user = { id, username, room }
    users.push(user)
    return user
}

//Get current user
function getCurrentUser(id) {
    return users.find((user) => user.id === id)
}

//User leaves the chat
function userLeave(id) {
    const index = users.findIndex( user => user.id === id)
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

//Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room)
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers }