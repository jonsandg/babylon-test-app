import React from 'react';
import { Game } from './components/Game';

function App() {
  return (
    <div className="bg-slate-400 h-full pt-10">
      <div className="bg-slate-50 h-42">
        <Game />
      </div>
    </div>
  );
}

export default App;
