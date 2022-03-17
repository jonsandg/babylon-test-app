import React, { useState, useRef, useEffect, Suspense } from 'react';
import { SceneLoader } from '@babylonjs/core/';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

import claire from './assets/characters/claire3.gltf';
import { useScene } from 'react-babylonjs';

const urlSlashSeparated = claire.split('/');
const rootUrl =
  urlSlashSeparated.slice(0, urlSlashSeparated.length - 1).join('/') + '/';
const fileName = urlSlashSeparated[urlSlashSeparated.length - 1];

const ContainerTest: React.FC = () => {
  const scene = useScene();
  const [claireContainer, setClaireContainer] = useState();

  useEffect(() => {
    SceneLoader.LoadAssetContainerAsync(rootUrl, fileName, scene).then(
      container => {
        const instances = container.instantiateModelsToScene();
        console.log(instances);
        for (let i of instances.rootNodes) {
          i.scaling = new Vector3(0.1, 0.1, 0.1);
        }
        instances.animationGroups[2].start(true);
      }
    );
  }, []);

  return null;
};

export { ContainerTest };
