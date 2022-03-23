import {
  AssetContainer,
  InstantiatedEntries,
  Quaternion,
  TransformNode,
  Vector3,
} from '@babylonjs/core';
import { Position, Rotation } from '@backend/types';
import React, {
  forwardRef,
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ILoadedModel, Model, useBeforeRender } from 'react-babylonjs';

export interface CharacterProps {
  container: AssetContainer | undefined;
  animation?: 'Idle' | 'RunForward' | 'RunBackward' | 'RunForwardFast' | string;
  id: string;
  position?: Position;
  rotation?: Rotation;
}

export const Character2: React.FC<CharacterProps> = ({
  animation = 'Idle',
  id,
  container,
  position,
  rotation,
}) => {
  const model = useRef<InstantiatedEntries>();
  const nodeRef = useRef<TransformNode>();

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

  const setAnimation = () => {
    const character = model.current;
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

  useEffect(() => {
    if (container) {
      const instances = container.instantiateModelsToScene(() => id);
      const mesh = instances.rootNodes[0];

      mesh.scaling = new Vector3(0.1, 0.1, 0.1);
      mesh.rotate(Vector3.Up(), Math.PI);
      mesh.position = nodeRef.current!.position;
      mesh.setParent(nodeRef.current!);
      mesh.position = Vector3.Zero();

      model.current = instances;
      setAnimation();
    }
  }, [container]);

  useEffect(setAnimation, [animation]);

  return (
    <transformNode
      ref={nodeRef}
      name={`node-${id}`}
      position={
        position
          ? new Vector3(position.x, position.y, position.z)
          : Vector3.Zero()
      }
      rotationQuaternion={
        rotation
          ? new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
          : new Quaternion()
      }
    ></transformNode>
  );
};
