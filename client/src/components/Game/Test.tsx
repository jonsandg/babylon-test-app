import { AbstractMesh, TransformNode, Vector3 } from '@babylonjs/core';
import React, {
  forwardRef,
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ILoadedModel,
  Model,
  TaskType,
  useAssetManager,
  useBeforeRender,
} from 'react-babylonjs';

import claire from './assets/characters/claire3.gltf';

export interface CharacterProps {
  x: number;
  name: string;
  animation: string;
}

const urlSlashSeparated = claire.split('/');
const rootUrl =
  urlSlashSeparated.slice(0, urlSlashSeparated.length - 1).join('/') + '/';
const fileName = urlSlashSeparated[urlSlashSeparated.length - 1];

const tasks = [
  { taskType: TaskType.Mesh, rootUrl, sceneFilename: fileName, name: 'claire' },
];

export const Test: React.FC<CharacterProps> = ({ x, name, animation }) => {
  const nodeRef = useRef<TransformNode>();

  const onModelLoaded = (mesh: AbstractMesh) => {
    if (nodeRef.current) mesh.setParent(nodeRef.current);
  };

  useBeforeRender(() => {
    if (nodeRef.current) {
      const node = nodeRef.current;
      node.position = new Vector3(x, 10, 0);
    }
  });

  return (
    <transformNode
      ref={nodeRef}
      //scaling={new Vector3(0.1, 0.1, 0.1)}
      name={`${name}-node`}
    >
      <Suspense fallback={Fallback}>
        <LoadModel name={name} x={x} onLoaded={onModelLoaded} />
      </Suspense>
    </transformNode>
  );
};

interface LoadModelProps {
  name: string;
  x?: number;
  onLoaded(mesh: AbstractMesh): any;
}

const LoadModel: React.FC<LoadModelProps> = ({ name, x, onLoaded }) => {
  const tasks = [
    { taskType: TaskType.Mesh, rootUrl, sceneFilename: fileName, name },
  ];

  // @ts-ignore
  const asd = useAssetManager(tasks);

  console.log(asd);

  // @ts-ignore

  // @ts-ignore
  asd.tasks[0].loadedMeshes[0].scaling = new Vector3(0.1, 0.1, 0.1);
  // @ts-ignore
  //asd.tasks[0].loadedMeshes[0].position = new Vector3(0, 0, 0);
  onLoaded(asd.tasks[0].loadedMeshes[0]);
  return null;
};

const Fallback = () => {
  return (
    <box name="box1" width={2} height={2} depth={2} position={Vector3.Zero()} />
  );
};
