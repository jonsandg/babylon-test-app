import React, { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import throttle from 'lodash.throttle';
import { GameScene } from './Scene';
import { IPlayer, IPosition, IRotation } from './types';

let socket: Socket;

interface IPlayerPositionData {
  id: string;
  position: IPosition;
  rotation: IPosition;
}

export const Game = () => {
  const [players, setPlayers] = useState<IPlayer[]>([]);

  useEffect(() => {
    socket = io('http://localhost:3001');
    socket.on('players/new', (player: IPlayer) => {
      console.log('new player', player);
      setPlayers(oldPlayers => [...oldPlayers, player]);
    });

    socket.on('players/list', (players: IPlayer[]) => {
      setPlayers(players);
    });

    socket.on('players/remove', ({ id }: { id: string }) => {
      setPlayers(oldPlayers => oldPlayers.filter(p => p.id !== id));
    });

    socket.on('players/position', (data: IPlayerPositionData) => {
      setPlayers(oldPlayers =>
        oldPlayers.map(p =>
          p.id === data.id
            ? { ...p, position: data.position, rotation: data.rotation }
            : p
        )
      );
    });
  }, []);

  const onPlayerPositionChange = throttle((pos: IPosition, rot: IRotation) => {
    if (socket) {
      socket.emit('position', {
        position: pos,
        rotation: rot,
      });
    }
  }, 10);

  return (
    <GameScene
      players={players}
      onPlayerPositionChange={onPlayerPositionChange}
    />
  );
};
