const express = require('express')
const path = require("path")
const http = require('http')
const socketio = require("socket.io")
const Filter = require("bad-words")
const { generateMessage, generateLocation } = require('./utils/messages')
const { addUser, getUser, getUsersInRoom, removeUser } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, "../public")))


io.on('connection', (socket) => {

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser(socket.id, username, room)
        if (error) {
            return callback(error)
        }
        socket.join(room)
        socket.emit("message", generateMessage("Welcome!", "ChatBot"))
        socket.broadcast.to(user.room).emit("message", generateMessage(`${user.username} just joined!`, "ChatBot"))
        callback()
    })

    socket.on("newMessage", (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
        io.to(user.room).emit("message", generateMessage(message, getUser(socket.id).username))
        callback()
    })
    socket.on("location", (position, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit("sentLocation",
            generateLocation(`https://google.com/maps?q=${position.longitude},${position.latitude}`))
        callback()
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id)
        socket.to(user.room).emit("message", generateMessage(`${user.username} has left!`, "ChatBot"))
    })
})

server.listen(port, () => {
    console.log(`Server up on port ${port}`)
})