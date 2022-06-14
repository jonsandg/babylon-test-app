import { Server, Socket } from 'socket.io';
import http from 'http';
import {
  ClientToServerSocketIOEvents,
  PlayerData,
  ServerToClientSocketIOEvents,
} from './api/types';
import { getServers } from './getServers';
import { getAgonesClient } from './agones';

const CLIENT_HOSTNAMES = (process.env.CLIENT_HOSTNAME || '').split(' ');

const server = http.createServer();
const io = new Server<
  ClientToServerSocketIOEvents,
  ServerToClientSocketIOEvents
>(server, {
  cors: {
    origin: CLIENT_HOSTNAMES,
  },
});

interface PlayerConnection {
  socket: Socket<ClientToServerSocketIOEvents, ServerToClientSocketIOEvents>;
  player: PlayerData;
}

let connections: PlayerConnection[] = [];

io.sockets.on('connection', async socket => {
  console.log('player connected');

  const agonesSDK = await getAgonesClient();
  agonesSDK.alpha.playerConnect(socket.id);

  socket.emit(
    'players/all',
    connections.map(p => p.player)
  );

  const newPlayer: PlayerConnection = {
    socket,
    player: {
      id: socket.id,
      name: 'lolol',
      object: {
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
        animation: 'Idle',
      },
    },
  };

  connections.push(newPlayer);

  connections.forEach(player => {
    if (newPlayer.socket.id !== player.socket.id) {
      player.socket.emit('players/new', newPlayer.player);
    }
  });

  socket.on('update', modelData => {
    connections = connections.map(connection => {
      if (connection.socket === socket) {
        return {
          ...connection,
          player: {
            ...connection.player,
            object: modelData,
          },
        };
      } else {
        connection.socket.emit('players/update', {
          id: socket.id,
          object: modelData,
        });
        return connection;
      }
    });
  });

  socket.on('disconnect', () => {
    connections = connections.filter(p => p.socket.id !== socket.id);
    connections.forEach(player => {
      player.socket.emit('players/removed', {
        id: socket.id,
      });
    });
    agonesSDK.alpha.playerDisconnect(socket.id);
  });
});

function getGameServers() {
  setTimeout(async () => {
    const servers = await getServers();
    //console.log(servers);
    io.emit('serversList', servers);
    getGameServers();
  }, 2000);
}

getGameServers();

export default server;
