import { Server } from 'socket.io';
import http from 'http';

const server = http.createServer();
const io = new Server(server);

io.sockets.on('connection', socket => {
  console.log('New connection', socket.id);
});

/************************************************************************************
 *                              Export Server
 ***********************************************************************************/

export default server;
