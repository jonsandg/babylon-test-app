import React, { useState, useRef } from 'react';

import '@babylonjs/core/Physics/physicsEngineComponent'; // side-effect adds scene.enablePhysics function
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';

import { CannonJSPlugin } from '@babylonjs/core/Physics/Plugins';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Nullable } from '@babylonjs/core/types';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { PhysicsImpostor } from '@babylonjs/core/Physics/physicsImpostor';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { FresnelParameters } from '@babylonjs/core/Materials/fresnelParameters';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';

import { Scene, Engine, useBeforeRender } from 'react-babylonjs';

import * as CANNON from 'cannon';
import { useKeyPress } from '../../hooks/useKeyPress';
import { Player } from './Player';
import { Ball } from './Ball';
import { IPlayer, IPosition, IRotation } from './types';
window.CANNON = CANNON;

const gravityVector = new Vector3(0, -9.81, 0);

export type GameSceneProps = {
  players: IPlayer[];
  onPlayerPositionChange?(position: IPosition, rotation: IRotation): void;
};

const GameScene: React.FC<GameSceneProps> = ({
  players,
  onPlayerPositionChange,
}) => {
  return (
    <div className="App">
      <Engine
        antialias={true}
        adaptToDeviceRatio={true}
        canvasId="sample-canvas"
      >
        <Scene enablePhysics={[gravityVector, new CannonJSPlugin()]}>
          <arcRotateCamera
            name="arc"
            target={new Vector3(0, 1, 0)}
            alpha={-Math.PI / 2}
            beta={0.5 + Math.PI / 4}
            radius={4}
            minZ={0.001}
            wheelPrecision={50}
            lowerRadiusLimit={8}
            upperRadiusLimit={20}
            upperBetaLimit={Math.PI / 2}
          />
          <hemisphericLight
            name="hemi"
            direction={new Vector3(0, -1, 0)}
            intensity={0.8}
          />
          <directionalLight
            name="shadow-light"
            setDirectionToTarget={[Vector3.Zero()]}
            direction={Vector3.Zero()}
            position={new Vector3(-40, 30, -40)}
            intensity={0.5}
            shadowMinZ={1}
            shadowMaxZ={2500}
          >
            <shadowGenerator
              mapSize={1024}
              useBlurExponentialShadowMap={true}
              blurKernel={32}
              darkness={0.8}
              shadowCasters={['sphere1', 'dialog']}
              forceBackFacesOnly={true}
              depthScale={100}
            />
          </directionalLight>
          <Player onPositionChange={onPlayerPositionChange} />
          {players.map(p => (
            <Ball key={p.id} position={p.position} rotation={p.rotation} />
          ))}
          <ground
            name="ground1"
            width={40}
            height={40}
            subdivisions={2}
            receiveShadows={true}
          >
            <physicsImpostor
              type={PhysicsImpostor.BoxImpostor}
              _options={{ mass: 0, restitution: 0.9 }}
            />
          </ground>
        </Scene>
      </Engine>
    </div>
  );
};
export { GameScene };
