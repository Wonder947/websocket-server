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
import { userJoinRoom, userQuitRoom } from './roomService.mjs';
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
  const rid = socket.handshake.auth.rid
  if (rid){
    socket.rid = rid
  }
  next()
})

io.on('connection', (socket)=>{
  console.log("a client has connected:", socket.id)

  // socket.on('greeting', (data)=>{console.log(data)})

  socket.on('test2', ()=>socket.emit('test2'))

  socket.on('joinHall', ()=>{
    socket.join('hall')
    console.log(socket.id, 'has joined the Hall')
  })

  socket.on('joinRoom', async (roomId)=>{
    socket.join(roomId)
    const userId = socket.uid
    socket.join(userId)
    // check and reflect new user join
    const newMemberNames = await userJoinRoom(userId, roomId)
    if (newMemberNames){
      io.to(roomId).emit('updateRoomMemberNames', newMemberNames)
      console.log("updating member names after some user entered", newMemberNames)
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

  socket.on('disconnect', async ()=>{
    console.log("user", socket.id, "has disconnected")

    if (socket.uid){
      // check number of user sockets inside the room uid
      // if the numebr of user sockets in that specific room is 0, quit the user from that room
      const matchingUidSockets = await io.in(socket.uid).fetchSockets()
      const numberUidSocksInRoomRid = matchingUidSockets.filter(soc=>soc.rid===socket.rid).length
      // console.log("left number of user sockets inside the room", numberUidSocksInRoomRid)
      const isDisconnected = numberUidSocksInRoomRid === 0
      if (isDisconnected){
        const newMemberNames = await userQuitRoom(socket.uid, socket.rid)
        io.to(socket.rid).emit('updateRoomMemberNames', newMemberNames)
        console.log("updating member names after some user quiting", newMemberNames)
      }
    }

  })

    setInterval(() => {
      socket.emit('test')
    }, 2000);
})

