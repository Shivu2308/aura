import http from 'http'
import expoess from 'express'
import { Server } from 'socket.io'

const app = expoess()

const server = http.createServer(app)

const io = new Server(server,{
    cors : {
        origin : 'https://aura-3m5s.onrender.com',
        methods:['GET', 'POST', 'DELETE']
    }
})

const userSocketMap = {}

export const getSocketId = (receiverId) => {
    return userSocketMap[receiverId]
}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId
    if(userId != undefined){
        userSocketMap[userId] = socket.id
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap))


    
    socket.on('disconnect', () => {
        delete userSocketMap[userId]
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    })
    
})

export {app, io, server}
