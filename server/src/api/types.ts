export interface PlayerData {
  name: string;
  id: string;
  object: ModelData;
}

export interface ModelData {
  position: Position;
  rotation: Rotation;
}

export interface Rotation {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface Position {
  x: number;
  y: number;
  z: number;
}

interface SettingsData {
  name: string;
}

interface PlayerUpdateData {
  id: string;
  object: ModelData;
}

interface PlayerRemovedData {
  id: string;
}

export interface ServerToClientSocketIOEvents {
  'players/all': (players: PlayerData[]) => void;
  'players/new': (player: PlayerData) => void;
  'players/removed': (data: PlayerRemovedData) => void;
  'players/update': (data: PlayerUpdateData) => void;
}

export interface ClientToServerSocketIOEvents {
  settings: (settings: SettingsData) => void;
  update: (data: ModelData) => void;
}
