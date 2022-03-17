import React, { useState, useRef, useEffect, Suspense } from 'react';

import '@babylonjs/core/Physics/physicsEngineComponent'; // side-effect adds scene.enablePhysics function
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
import '@babylonjs/loaders/glTF/2.0';

import { CannonJSPlugin } from '@babylonjs/core/Physics/Plugins';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Nullable } from '@babylonjs/core/types';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { PhysicsImpostor } from '@babylonjs/core/Physics/physicsImpostor';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { FresnelParameters } from '@babylonjs/core/Materials/fresnelParameters';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { SceneLoader } from '@babylonjs/core/';

import {
  Scene,
  Engine,
  useBeforeRender,
  AssetManagerContextProvider,
} from 'react-babylonjs';

import * as CANNON from 'cannon';
import { Player } from './Player';
import { PlayerCharacter } from './PlayerCharacter';
import { Character } from './Character';
import { BallControlled } from './Ball';
import { PlayerData, Position, Rotation } from '@backend/types';
import { Test } from './Test';
import { ContainerTest } from './ContainerTest';
window.CANNON = CANNON;

const gravityVector = new Vector3(0, -9.81, 0);

export type GameSceneProps = {
  players: PlayerData[];
  onPlayerPositionChange?(position: Position, rotation: Rotation): void;
};

const GameScene: React.FC<GameSceneProps> = ({
  players,
  onPlayerPositionChange,
}) => {
  let playerRef = useRef<Nullable<Mesh>>();

  const [chars, setChars] = useState([
    { x: 0, name: 'claire', animation: 'Idle' },
  ]);

  useEffect(() => {
    setTimeout(() => {
      setChars(chars => [
        ...chars,
        { x: -5, name: 'claire2', animation: 'RunForward' },
      ]);
    }, 1000);
  }, []);

  return (
    <div className="App">
      <Engine
        antialias={true}
        adaptToDeviceRatio={true}
        canvasId="sample-canvas"
      >
        <Scene enablePhysics={[gravityVector, new CannonJSPlugin()]}>
          <freeCamera
            name="camera1"
            position={new Vector3(0, 10, -20)}
            setTarget={[Vector3.Zero()]}
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
          <ContainerTest />
          {/*<Player ref={playerRef} onPositionChange={onPlayerPositionChange} />
          <PlayerCharacter />
          <Character model="claire" id="player2" />

          
          <AssetManagerContextProvider>
            <Suspense fallback={null}>
              {chars.map(c => (
                <Test {...c} />
              ))}
            </Suspense>
          </AssetManagerContextProvider>

          */}

          {players.map(p => (
            <BallControlled
              key={p.id}
              position={p.object.position}
              rotation={p.object.rotation}
            />
          ))}
          <ground
            name="ground1"
            width={100}
            height={100}
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
