import { Server } from "socket.io";
import { createServer } from "http";
import express from 'express'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on("connection", (socket) => {
  console.log("a client has connected:", socket.id)

  socket.on("greeting", (data)=>{
    console.log("greeting data: ", data)
  })
});

httpServer.listen(3001, ()=>{
    console.log('server is listening on the port 3001')
})

// export const webSocketServer = {
//     io: wssIo()
// }

// function wssIo(){
//     console.log("???? is this running")

//     const httpServer = createServer()
//     const io = new Server(httpServer, {});

//     io.on("connection", (socket) => {
//     console.log("a client has connected:", socket.id)

//     socket.on("greeting", (data)=>{
//         console.log("greeting data: ", data)
//     })
//     });

//     httpServer.listen(3001)
// }
