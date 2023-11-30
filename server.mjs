import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
const app = express();
const server = createServer(app);
const io = new Server(server);
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

})

