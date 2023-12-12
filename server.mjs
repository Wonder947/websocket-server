import dotenv from "dotenv";
dotenv.config()
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
// import { db } from "./db.mjs";
const app = express();
const server = createServer(app);
const allowed_origins = process.env.CORS_ALLOWED_ORIGIN.split('&')
console.log(allowed_origins)
const io = new Server(server, {
  cors: {
    origin: allowed_origins
  }
});
import url from 'url';
import path from 'path';
import { userJoinRoom } from './roomService.mjs';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3001
server.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
});


// add userId middleware
io.use((socket, next)=>{
  const uid = socket.handshake.auth.uid
  if (uid){
    socket.uid = uid
  }
  next()
})

io.on('connection', (socket)=>{
  console.log("a client has connected:", socket.id)

  // console.log("???TEST", db.Room.find().then(d=>d.toString()).then(d=>console.log(d))) //test success
  // console.log("???UID", socket.uid)  //test success

  socket.on('greeting', (data)=>{console.log(data)})

  socket.on('test2', ()=>socket.emit('test2'))

  socket.on('joinHall', ()=>{
    socket.join('hall')
    console.log(socket.id, 'has joined the Hall')
  })

  socket.on('joinRoom', async (roomId)=>{
    socket.join(roomId)
    console.log(socket.id, 'has joined room', roomId)
    // check and reflect new user join in db
    const userId = socket.uid
    const newMemberNames = await userJoinRoom(userId, roomId)
    // console.log("???need update?", needUpdate)  //test success
    if (newMemberNames){
      io.to('roomId').emit('updateRoomMemberNames', newMemberNames)
      console.log("updating member names", newMemberNames)
    }
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

