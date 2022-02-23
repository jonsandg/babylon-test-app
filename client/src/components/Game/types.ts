export interface IPosition {
  x: number;
  y: number;
  z: number;
}

export interface IRotation {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface IPlayer {
  id: string;
  name: string;
  position: IPosition;
  rotation: IPosition;
}
