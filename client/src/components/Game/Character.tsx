import { Vector3 } from '@babylonjs/core';
import React, {
  forwardRef,
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ILoadedModel, Model, useBeforeRender } from 'react-babylonjs';

import claire from './assets/characters/claire3.gltf';

export interface CharacterProps {
  model: 'claire';
  animation?: 'Idle' | 'RunForward' | 'RunBackward' | 'RunForwardFast' | string;
  id: string;
}

export const Character: React.FC<CharacterProps> = ({
  animation = 'Idle',
  id,
}) => {
  const urlSlashSeparated = claire.split('/');
  const rootUrl =
    urlSlashSeparated.slice(0, urlSlashSeparated.length - 1).join('/') + '/';
  const fileName = urlSlashSeparated[urlSlashSeparated.length - 1];

  const model = useRef<ILoadedModel>();

  /*
  useBeforeRender(scene => {
    const character = model.current;
    if (character && !animating) {
      const anim = character.animationGroups?.find(
        a => a.name === 'RunForward'
      );
      anim?.start(true, 1.0, anim.from, anim.to, false);
      setAnimating(true);
    }
  });
  */

  /*
  const setJumpAnimationsObservables = () => {
    if (model.current && model.current.animationGroups) {
      model.current.animationGroups
        .filter(a => a.name.includes('Jump'))
        .forEach(a => a.onAnimationEndObservable.add(setAnimation));
    }
  };
  */

  //console.log(animation);

  if (model.current) {
    console.log(id);
  }

  const setAnimation = () => {
    const character = model.current;
    console.log(character);
    if (character && character.animationGroups) {
      const jumpAnimationPlaying = character.animationGroups
        .filter(a => a.name.includes('Jump'))
        .find(a => a.isPlaying);

      if (!jumpAnimationPlaying) {
        character.animationGroups.map(a => a.stop());
        const anim = character.animationGroups?.find(a => a.name === animation);

        const loopAnimation = !anim?.name.includes('Jump');
        anim?.start(loopAnimation, 1.0, anim.from, anim.to, false);
      } else {
        jumpAnimationPlaying.onAnimationEndObservable.clear();
        jumpAnimationPlaying.onAnimationEndObservable.addOnce(() => {
          console.log('anim finished');

          jumpAnimationPlaying.onAnimationEndObservable.clear();
          jumpAnimationPlaying.stop();
          setAnimation();
        });
      }
    }
  };

  useEffect(setAnimation, [animation]);

  return (
    <Suspense fallback={Fallback}>
      <Model
        rootUrl={rootUrl}
        sceneFilename={fileName}
        name={id}
        position={new Vector3(0, 0, 0)}
        scaling={new Vector3(0.1, 0.1, 0.1)}
        onModelError={e => console.error(e)}
        onModelLoaded={loadedModel => {
          console.log('model loaded');
          model.current = loadedModel;
          setAnimation();
          console.log(loadedModel);
          const newmesh = loadedModel.rootMesh!.clone(
            'player3',
            loadedModel.rootMesh!
          );
          // loadedModel.rootMesh?.clone('player2');
          console.log(newmesh);
          newmesh!.position = new Vector3(10, 0, 0);
        }}
      />
    </Suspense>
  );
};

const Fallback = () => {
  return (
    <box name="box1" width={2} height={2} depth={2} position={Vector3.Zero()} />
  );
};
