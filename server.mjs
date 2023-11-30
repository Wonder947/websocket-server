import dotenv from "dotenv";
dotenv.config()
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
const app = express();
const server = createServer(app);
console.log(process.env.CORS_ALLOWED_ORIGIN)
const io = new Server(server, {
  cors: {
    origin: [process.env.CORS_ALLOWED_ORIGIN, 'http://localhost:3000']
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

    setInterval(() => {
      socket.emit('test')
    }, 2000);
})

