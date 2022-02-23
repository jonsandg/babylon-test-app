import { Server, Socket } from 'socket.io';
import http from 'http';

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

interface Position {
  x: number;
  y: number;
  z: number;
}

interface Rotation {
  x: number;
  y: number;
  z: number;
  w: number;
}
interface Player {
  socket: Socket;
  name: string;
  position: Position;
  rotation: Rotation;
}

interface PositionData {
  position: Position;
  rotation: Rotation;
}

let players: Player[] = [];

io.sockets.on('connection', socket => {
  socket.emit(
    'players/list',
    players.map(p => ({
      id: p.socket.id,
      name: p.name,
      position: p.position,
      rotation: p.rotation,
    }))
  );

  const newPlayer: Player = {
    socket,
    name: 'lolol',
    position: {
      x: 0,
      y: 1.5,
      z: 0,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
      w: 0,
    },
  };

  players.push(newPlayer);

  players.forEach(player => {
    if (newPlayer.socket.id !== player.socket.id) {
      player.socket.emit('players/new', {
        id: socket.id,
        name: newPlayer.name,
        position: newPlayer.position,
        rotation: newPlayer.rotation,
      });
    }
  });

  socket.on('position', ({ position, rotation }: PositionData) => {
    console.log(rotation);
    players.map(player => {
      if (player.socket === socket) {
        return { ...player, position, rotation };
      } else {
        player.socket.emit('players/position', {
          id: socket.id,
          position,
          rotation,
        });
        return player;
      }
    });
  });

  socket.on('disconnect', () => {
    players = players.filter(p => p.socket.id !== socket.id);
    players.forEach(player => {
      player.socket.emit('players/remove', {
        id: socket.id,
      });
    });
  });
});

/************************************************************************************
 *                              Export Server
 ***********************************************************************************/

export default server;
