import React, { useState, useRef, useEffect, Suspense } from 'react';

import '@babylonjs/core/Physics/physicsEngineComponent'; // side-effect adds scene.enablePhysics function
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
import '@babylonjs/loaders/glTF/2.0';

import { CannonJSPlugin } from '@babylonjs/core/Physics/Plugins';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Nullable } from '@babylonjs/core/types';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { PhysicsImpostor } from '@babylonjs/core/Physics/physicsImpostor';

import { Scene, Engine, Skybox } from 'react-babylonjs';

import * as CANNON from 'cannon';
import { PlayerCharacter } from './PlayerCharacter';
import { Character } from './Character';
import { PlayerData, Position, Rotation } from '@backend/types';
import { LoadModels, ModelContainers } from './LoadModels';
window.CANNON = CANNON;

const gravityVector = new Vector3(0, -9.81, 0);

export type GameSceneProps = {
  players: PlayerData[];
  onPlayerPositionChange?(
    position: Position,
    rotation: Rotation,
    animation: string
  ): void;
};

const GameScene: React.FC<GameSceneProps> = ({
  players,
  onPlayerPositionChange,
}) => {
  let playerRef = useRef<Nullable<Mesh>>();

  const [models, setModels] = useState<ModelContainers>({});

  return (
    <div className="App">
      <Engine
        antialias={true}
        adaptToDeviceRatio={true}
        canvasId="sample-canvas"
      >
        <Scene enablePhysics={[gravityVector, new CannonJSPlugin()]}>
          {/* <freeCamera
            name="camera1"
            position={new Vector3(0, 10, -20)}
            setTarget={[Vector3.Zero()]}
          /> */}
          <Skybox rootUrl="/textures/TropicalSunnyDay" size={1000} />
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
              shadowCasters={['player', ...players.map(p => p.id)]}
              forceBackFacesOnly={true}
              depthScale={100}
            />
          </directionalLight>
          <LoadModels onModelsLoaded={setModels} />
          <PlayerCharacter
            container={models.claire}
            onPositionChange={onPlayerPositionChange}
          />

          {players.map(p => (
            <Character
              container={models.claire}
              key={p.id}
              id={p.id}
              position={p.object.position}
              rotation={p.object.rotation}
              animation={p.object.animation}
            />
          ))}
          <ground
            name="ground1"
            width={1000}
            height={1000}
            subdivisions={10}
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
