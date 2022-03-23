import React, { useState, useRef, useEffect, Suspense } from 'react';
import { SceneLoader, AssetContainer } from '@babylonjs/core/';

import claire from './assets/characters/claire.gltf';
import { useScene } from 'react-babylonjs';

const getUrlAndFileName = (path: string) => {
  const urlSlashSeparated = path.split('/');
  const rootUrl =
    urlSlashSeparated.slice(0, urlSlashSeparated.length - 1).join('/') + '/';
  const fileName = urlSlashSeparated[urlSlashSeparated.length - 1];
  const name = fileName.split('.')[0];
  return { rootUrl, fileName, name };
};

interface LoadModelsProps {
  onModelsLoaded(containers: ModelContainers): void;
}

export interface ModelContainers {
  [key: string]: AssetContainer;
}

const LoadModels: React.FC<LoadModelsProps> = ({ onModelsLoaded }) => {
  const scene = useScene();

  useEffect(() => {
    const models = [claire].map(getUrlAndFileName);

    Promise.all(
      models.map(model =>
        SceneLoader.LoadAssetContainerAsync(
          model.rootUrl,
          model.fileName,
          scene
        ).then(container => ({
          container,
          name: model.name,
        }))
      )
    ).then(models => {
      //setModelContainers(containers);
      const containers = models.reduce(
        (acc, model) => ({
          ...acc,
          [model.name]: model.container,
        }),
        {}
      );
      onModelsLoaded(containers);
    });
  }, []);

  return null;
};

export { LoadModels };
