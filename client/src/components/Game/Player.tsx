import React, { useRef } from 'react';

import { Nullable } from '@babylonjs/core/types';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { useBeforeRender } from 'react-babylonjs';

import { useKeyPress } from '../../hooks/useKeyPress';

import { Ball } from './Ball';
import { IPosition, IRotation } from './types';

interface PlayerProps {
  onPositionChange?(position: IPosition, rotation: IRotation): any;
}

const getAxisData = (vector: Vector3) => {
  const { x, y, z } = vector;
  return { x, y, z };
};

export const Player: React.FC<PlayerProps> = ({ onPositionChange }) => {
  let sphereRef = useRef<Nullable<Mesh>>();

  const wIsPressed = useKeyPress('w');
  const aIsPressed = useKeyPress('a');
  const sIsPressed = useKeyPress('s');
  const dIsPressed = useKeyPress('d');

  useBeforeRender(scene => {
    if (sphereRef.current) {
      const sphere = sphereRef.current;
      const v = 1.4;
      const dt = scene.getEngine().getDeltaTime();
      if (wIsPressed) {
        sphere.physicsImpostor?.applyForce(
          Vector3.Forward().scale(v * dt),
          sphere.getAbsolutePosition()
        );
      }

      if (aIsPressed) {
        sphere.physicsImpostor?.applyForce(
          Vector3.Left().scale(v * dt),
          sphere.getAbsolutePosition()
        );
      }

      if (sIsPressed) {
        sphere.physicsImpostor?.applyForce(
          Vector3.Backward().scale(v * dt),
          sphere.getAbsolutePosition()
        );
      }

      if (dIsPressed) {
        sphere.physicsImpostor?.applyForce(
          Vector3.Right().scale(v * dt),
          sphere.getAbsolutePosition()
        );
      }

      const pos = getAxisData(sphere.getAbsolutePosition());
      const rot = sphere.rotationQuaternion;

      onPositionChange && rot && onPositionChange(pos, rot);
    }
  });

  return <Ball ref={sphereRef} />;
};
