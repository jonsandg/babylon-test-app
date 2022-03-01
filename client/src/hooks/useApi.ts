import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import throttle from 'lodash.throttle';

import {
  Position,
  Rotation,
  ClientToServerSocketIOEvents,
  ServerToClientSocketIOEvents,
  PlayerData,
} from '@backend/types';

const API_ENDPOINT =
  process.env.REACT_APP_API_ENDPOINT || 'http:localhost:3001';

export const useApi = () => {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const socket =
    useRef<
      Socket<ServerToClientSocketIOEvents, ClientToServerSocketIOEvents>
    >();

  useEffect(() => {
    socket.current = io(API_ENDPOINT);

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
  }, []);

  const updatePlayerObject = throttle((pos: Position, rot: Rotation) => {
    if (socket.current) {
      socket.current.emit('update', {
        position: pos,
        rotation: rot,
      });
    }
  }, 10);

  return [players, updatePlayerObject] as const;
};
