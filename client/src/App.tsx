import React, { useEffect, useState, useCallback } from 'react';

import { useApi } from './hooks/useApi';
import { GameScene } from './components/Game';
import { ServerPicker } from './components/ServerPicker';

const API_ENDPOINT =
  process.env.REACT_APP_API_ENDPOINT || 'http://localhost:3001';

function App() {
  const [players, updatePlayerObject, servers, currentServer, connectToServer] =
    useApi();

  useEffect(() => {
    connectToServer(API_ENDPOINT);
  }, [connectToServer]);

  return (
    <div className="bg-slate-400 h-full pt-10">
      <div className="bg-slate-50 h-42">
        <GameScene
          players={players}
          onPlayerPositionChange={updatePlayerObject}
        />
      </div>
      <ServerPicker
        currentServer={currentServer}
        servers={servers}
        onServerPick={connectToServer}
      />
    </div>
  );
}

export default App;
