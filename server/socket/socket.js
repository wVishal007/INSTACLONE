import { Server } from "socket.io";
import express from 'express'
import http from 'http'
import { log } from "console";

const app = express()
const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:'http://localhost:5173',
        methods:['GET','POST']
    }
})

const userSocketMap = {} //this map stores socket id corresponding to user id

export const getRecieverSocketID = (recieverID) => userSocketMap[recieverID]


io.on('connection',(socket)=>{
const userId = socket.handshake.query.userId;
if(userId){
    userSocketMap[userId] = socket.id;
    console.log(`user connected userId = ${userId} ,socketId = ${socket.id}`);
    
}
io.emit('getOnlineUsers',Object.keys(userSocketMap))

socket.on('disconnect',(socket)=>{
    if(userId){
        delete userSocketMap[userId]
    }
    io.emit('getOnlineUsers',Object.keys(userSocketMap))
})
})

export {app,server,io};