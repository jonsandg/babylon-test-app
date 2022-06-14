import { Server } from '@backend/types';
import React, { useEffect, useState, useCallback } from 'react';

type ServerPickerProps = {
  onServerPick(ip: string): void;
  servers: Server[];
  currentServer: string;
};

export function ServerPicker({
  onServerPick,
  servers,
  currentServer,
}: ServerPickerProps) {
  const [serverAddressInput, setServerAddressInput] = useState('');

  function onSubmit() {
    onServerPick(serverAddressInput);
  }

  return (
    <div className="px-5 py-5">
      <div>Current server: {currentServer}</div>
      <input
        type="text"
        placeholder="IP address"
        value={serverAddressInput}
        onChange={e => setServerAddressInput(e.currentTarget.value)}
      />
      <button className="py-2 px-2 rounded" onClick={onSubmit}>
        Connect
      </button>
      {servers.map(server => {
        const s = `${server.address}:${server.port}`;
        return (
          <div className="my-6" key={s}>
            <span
              onClick={() => onServerPick(s)}
              className={`bg-white hover:bg-gray-500 py-2 px-2 ${
                s === currentServer && 'bg-green-300'
              }`}
            >
              {s}
            </span>

            <span className="ml-2">
              Players: {`${server.players.count}/${server.players.capacity}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
