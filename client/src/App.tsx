import React from 'react';
import { Game } from './components/Game';

function App() {
  return (
    <div className="bg-slate-400 h-full pt-10">
      <div className="bg-slate-50 w-3/4 h-64 mx-auto">
        <Game />
      </div>
    </div>
  );
}

export default App;
