const express = require('express')
const path = require("path")
const http = require('http')
const socketio = require("socket.io")
const Filter = require("bad-words")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, "../public")))


io.on('connection', (socket) => {
    socket.emit("message", "Welcome!")
    socket.broadcast.emit("message", "A new user just joined!")
    socket.on("newMessage", (message, callback) => {
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }
        io.emit("message", message)
        callback()
    })
    socket.on("location", (position, callback) => {
        socket.broadcast.emit("sentLocation", `https://google.com/maps?q=${position.longitude},${position.latitude}`)
        callback()
    })

    socket.on("disconnect", () => {
        io.emit("message", "A user has disconnected!")
    })
})

server.listen(port, () => {
    console.log(`Server up on port ${port}`)
})