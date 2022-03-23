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

export interface CharacterProps {
  container: AssetContainer | undefined;
  animation?: 'Idle' | 'RunForward' | 'RunBackward' | 'RunForwardFast' | string;
  id: string;
  position?: Position;
  rotation?: Rotation;
}

export const Character: React.FC<CharacterProps> = ({
  animation = 'Idle',
  id,
  container,
  position,
  rotation,
}) => {
  const model = useRef<InstantiatedEntries>();
  const nodeRef = useRef<TransformNode>();

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

      mesh.position = position
        ? new Vector3(position.x, position.y, position.z)
        : Vector3.Zero();

      if (rotation) {
        mesh.rotationQuaternion = new Quaternion(
          rotation.x,
          rotation.y,
          rotation.z,
          rotation.w
        );
      }

      /*
      mesh.setParent(nodeRef.current!);

      
      mesh.position = nodeRef.current!.position;
      
      mesh.position = Vector3.Zero();
      */

      model.current = instances;
      setAnimation();

      return () => {
        mesh.dispose();
      };
    }
  }, [container]);

  useEffect(setAnimation, [animation]);

  useEffect(() => {
    if (position && model.current) {
      model.current.rootNodes[0].position = new Vector3(
        position.x,
        position.y,
        position.z
      );
    }

    if (rotation && model.current) {
      model.current.rootNodes[0].rotationQuaternion = new Quaternion(
        rotation.x,
        rotation.y,
        rotation.z,
        rotation.w
      );
    }
  }, [position, rotation]);

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
