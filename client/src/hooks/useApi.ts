import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import throttle from 'lodash.throttle';

import {
  Position,
  Rotation,
  ClientToServerSocketIOEvents,
  ServerToClientSocketIOEvents,
  PlayerData,
  Server,
} from '@backend/types';

export const useApi = () => {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [currentServer, setCurrentServer] = useState('');
  const [servers, setServers] = useState<Server[]>([]);

  // console.log(servers);

  const socket =
    useRef<
      Socket<ServerToClientSocketIOEvents, ClientToServerSocketIOEvents>
    >();

  useEffect(() => {
    if (!currentServer) {
      return;
    }

    console.log('Clearing players...');
    setPlayers([]);

    console.log(`Connecting to ${currentServer}`);

    if (socket.current?.connected) {
      socket.current.disconnect();
    }

    socket.current = io(currentServer);

    socket.current.on('connect', () => {
      console.log(`Connected to ${currentServer}`);
    });

    socket.current.on('disconnect', () => {
      console.log(`Disconnected from server`);
    });

    socket.current.on('players/new', player => {
      console.log('new player', player);
      setPlayers(oldPlayers => [...oldPlayers, player]);
    });

    socket.current.on('players/all', players => {
      setPlayers(players);
    });

    socket.current.on('players/removed', ({ id }) => {
      setPlayers(oldPlayers => oldPlayers.filter(p => p.id !== id));
    });

    socket.current.on('players/update', data => {
      setPlayers(oldPlayers =>
        oldPlayers.map(p =>
          p.id === data.id ? { ...p, object: data.object } : p
        )
      );
    });

    socket.current.on('serversList', servers => {
      setServers(servers);
    });
  }, [currentServer]);

  const updatePlayerObject = throttle(
    (pos: Position, rot: Rotation, animation: string) => {
      if (socket.current) {
        socket.current.emit('update', {
          position: pos,
          rotation: rot,
          animation,
        });
      }
    },
    10
  );

  return [
    players,
    updatePlayerObject,
    servers,
    currentServer,
    setCurrentServer,
  ] as const;
};
