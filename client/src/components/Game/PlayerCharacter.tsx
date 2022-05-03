import React, { forwardRef, useRef, useState, useEffect } from 'react';

import { Nullable } from '@babylonjs/core/types';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import {
  AssetContainer,
  Quaternion,
  TransformNode,
  UniversalCamera,
} from '@babylonjs/core';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { useBeforeRender } from 'react-babylonjs';

import { useKeyPress } from '../../hooks/useKeyPress';

import { Character } from './Character';
import { Position, Rotation } from '@backend/types';

interface PlayerProps {
  onPositionChange?(
    position: Position,
    rotation: Rotation,
    animation: string
  ): any;
  container: AssetContainer;
}

const getVectorData = (vector: Vector3) => {
  const { x, y, z } = vector;
  return { x, y, z };
};

const getQuaternionData = (q: Quaternion) => {
  const { x, y, z, w } = q;
  return { x, y, z, w };
};

export const PlayerCharacter = forwardRef<
  Nullable<Mesh> | undefined,
  PlayerProps
>(({ onPositionChange, container }, sphereRef) => {
  const nodeRef = useRef<Nullable<Mesh>>();
  const charRef = useRef<Nullable<TransformNode>>();
  const cameraRef = useRef<UniversalCamera>();

  const wIsPressed = useKeyPress('w');
  const aIsPressed = useKeyPress('a');
  const sIsPressed = useKeyPress('s');
  const dIsPressed = useKeyPress('d');
  const spaceIsPressed = useKeyPress(' ');

  const [animation, setAnimation] = useState('Idle');

  useBeforeRender(scene => {
    if (charRef.current) {
      const node = charRef.current;

      if (!node.rotationQuaternion) {
        node.rotate(Vector3.Zero(), 0);
      }

      const PLAYER_SPEED = 35;
      const PLAYER_SPEED_BACKWARD = PLAYER_SPEED * 0.7;
      const PLAYER_ROTATION_SPEED = 4;

      const dt = scene.getEngine().getDeltaTime();

      const adjustedPlayerSpeed = (PLAYER_SPEED * dt) / 1000;
      const adjustedPlayerSpeedBackward = (PLAYER_SPEED_BACKWARD * dt) / 1000;
      const adjustedPlayerRotationSpeed = (PLAYER_ROTATION_SPEED * dt) / 1000;

      if (wIsPressed) {
        node.position = node.position.add(
          node.forward.scaleInPlace(adjustedPlayerSpeed)
        );
      }

      if (aIsPressed) {
        node.rotate(Vector3.Up(), -adjustedPlayerRotationSpeed);
      }

      if (sIsPressed) {
        node.position = node.position.add(
          node.forward.scaleInPlace(-adjustedPlayerSpeedBackward)
        );
      }

      if (dIsPressed) {
        node.rotate(Vector3.Up(), adjustedPlayerRotationSpeed);
      }

      const pos = getVectorData(node.getAbsolutePosition());
      const rot = getQuaternionData(node.rotationQuaternion!);

      if (cameraRef.current) {
        const camera = cameraRef.current;
        // camera.position = node.forward;
        camera.target = node.position.add(Vector3.Up().scale(10));
      }

      onPositionChange && rot && onPositionChange(pos, rot, animation);
    }
  });

  useEffect(() => {
    if (spaceIsPressed) {
      if (wIsPressed) {
        setAnimation('JumpForward');
      } else if (sIsPressed) {
        setAnimation('JumpBackward');
      } else {
        setAnimation('JumpStill');
      }
    } else {
      if (wIsPressed) {
        setAnimation('RunForward');
      } else if (sIsPressed) {
        setAnimation('RunBackward');
      } else {
        setAnimation('Idle');
      }
    }
  }, [wIsPressed, sIsPressed, spaceIsPressed]);

  /*
  let pos, rot;

  if (nodeRef.current) {
    const node = nodeRef.current;
    pos = getVectorData(node.getAbsolutePosition());
    if (node.rotationQuaternion)
      rot = getQuaternionData(node.rotationQuaternion);
  }
  */

  return (
    <transformNode name="player" ref={nodeRef}>
      <Character
        container={container}
        animation={animation}
        id="player"
        onMounted={mesh => {
          charRef.current = mesh;
        }}
      />
      <universalCamera
        name="FollowCam"
        ref={cameraRef}
        position={new Vector3(0, 15, -50)}
        target={Vector3.Zero()}
      />
    </transformNode>
  );
});
