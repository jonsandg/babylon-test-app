import React, { forwardRef, useRef, MutableRefObject, useEffect } from 'react';

import { Nullable } from '@babylonjs/core/types';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { FollowCamera, Quaternion, UniversalCamera } from '@babylonjs/core';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { useBeforeRender } from 'react-babylonjs';

import { useKeyPress } from '../../hooks/useKeyPress';

import { BallWithPhysics } from './Ball';
import { Position, Rotation } from '@backend/types';
interface PlayerProps {
  onPositionChange?(position: Position, rotation: Rotation): any;
}

const getVectorData = (vector: Vector3) => {
  const { x, y, z } = vector;
  return { x, y, z };
};

const getQuaternionData = (q: Quaternion) => {
  const { x, y, z, w } = q;
  return { x, y, z, w };
};

export const Player = forwardRef<Nullable<Mesh> | undefined, PlayerProps>(
  ({ onPositionChange }, sphereRef) => {
    const mySphereRef = useRef<Nullable<Mesh>>();
    const cameraRef = useRef<UniversalCamera>();

    const wIsPressed = useKeyPress('w');
    const aIsPressed = useKeyPress('a');
    const sIsPressed = useKeyPress('s');
    const dIsPressed = useKeyPress('d');

    /*
    useEffect(() => {
      if (cameraRef.current && mySphereRef.current) {
        cameraRef.current.lockedTarget = mySphereRef.current;
      }
    }, [cameraRef, mySphereRef]);
    */

    useBeforeRender(scene => {
      if (mySphereRef.current) {
        const sphere = mySphereRef.current;
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

        const pos = getVectorData(sphere.getAbsolutePosition());
        const rot = getQuaternionData(sphere.rotationQuaternion!);

        onPositionChange && rot && onPositionChange(pos, rot);

        if (cameraRef.current) {
          const camera = cameraRef.current;
          const spherePosition = sphere.getAbsolutePosition();

          camera.setTarget(spherePosition);
          camera.position = spherePosition.add(new Vector3(0, 8, -15));
        }
      }
    });

    return (
      <>
        <BallWithPhysics
          ref={node => {
            if (node) {
              mySphereRef.current = node;
              if (typeof sphereRef === 'function') {
                sphereRef(node);
              } else if (sphereRef) {
                (sphereRef as MutableRefObject<Nullable<Mesh>>).current = node;
              }
            }
          }}
        ></BallWithPhysics>
        <universalCamera
          name="FollowCam"
          ref={cameraRef}
          position={new Vector3(0, 5, -10)}
        />
      </>
    );
  }
);
