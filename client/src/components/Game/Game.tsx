import React, { useEffect, useState, useCallback } from 'react';

import { useApi } from '../../hooks/useApi';
import { GameScene } from './Scene';

export const Game = () => {
  const [players, updatePlayerObject] = useApi();

  return (
    <GameScene players={players} onPlayerPositionChange={updatePlayerObject} />
  );
};
