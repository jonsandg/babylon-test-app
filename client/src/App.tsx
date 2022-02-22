import React from 'react';
import { GameScene } from './components/Game';

function App() {
  return (
    <div className="bg-slate-400 h-full pt-10">
      <div className="bg-slate-50 w-2/3 h-64 mx-auto">
        <GameScene />
      </div>
    </div>
  );
}

export default App;
