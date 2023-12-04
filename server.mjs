import dotenv from "dotenv";
dotenv.config()
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
const app = express();
const server = createServer(app);
const allowed_origins = process.env.CORS_ALLOWED_ORIGIN.split('&')
// console.log(allowed_origins)
const io = new Server(server, {
  cors: {
    origin: allowed_origins
  }
});
import url from 'url';
import path from 'path';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3001
server.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
});


io.on('connection', (socket)=>{
  console.log("a client has connected:", socket.id)

  socket.on('greeting', (data)=>{console.log(data)})

  socket.on('test2', ()=>socket.emit('test2'))

  socket.on('join', (room)=>{
    socket.join(room)
    console.log(socket.id, 'has joined room', room)
  })

  socket.on('updateRoomList', ()=>{
    console.log(socket.id, 'request update room list')
    io.to('hall').emit('updateRoomList')
  })

  socket.on('requestUpdateRoomInfo', (roomId)=>{
    console.log(socket.id, 'request update roominfo of', roomId)
    io.to(roomId).emit('updateRoomInfo')
  })

    setInterval(() => {
      socket.emit('test')
    }, 2000);
})

