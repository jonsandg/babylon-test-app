import React, { forwardRef, useRef } from 'react';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Quaternion } from '@babylonjs/core';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { Nullable } from '@babylonjs/core/types';
import { PhysicsImpostor } from '@babylonjs/core/Physics/physicsImpostor';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { FresnelParameters } from '@babylonjs/core/Materials/fresnelParameters';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Position, Rotation } from '@backend/types';

import amiga from './assets/textures/amiga.jpg';
import { useBeforeRender } from 'react-babylonjs';

interface BallProps {
  position?: Position;
  rotation?: Rotation;
  physicsEnabled?: boolean;
  children?: React.ReactNode;
}

const Ball = forwardRef<Nullable<Mesh> | undefined, BallProps>(
  ({ position, rotation, physicsEnabled, children }, ref) => {
    const textPlaneRef = useRef<Mesh>();
    const sphereRef = useRef<Mesh>();

    useBeforeRender(scene => {
      if (textPlaneRef.current && ref) {
        const spherePosition = ref;
      }
    });

    const sphereProps = {
      ref,
      name: 'sphere1',
      diameter: 2,
      segments: 16,
      position: position
        ? new Vector3(position.x, position.y, position.z)
        : new Vector3(0, 1.5, 0),
      ...(rotation && {
        rotationQuaternion: new Quaternion(
          rotation.x,
          rotation.y,
          rotation.z,
          rotation.w
        ),
      }),
    };

    return (
      <>
        <sphere {...sphereProps}>
          {physicsEnabled && (
            <physicsImpostor
              type={PhysicsImpostor.SphereImpostor}
              _options={{ mass: 1, restitution: 0.9 }}
            />
          )}
          <standardMaterial
            name="material1"
            specularPower={16}
            //diffuseColor={Color3.Red()}
          >
            <texture url={amiga} assignTo="diffuseTexture" />
          </standardMaterial>
          {children}
        </sphere>
        {/*
        <plane
          name="dialog"
          size={2}
          position={Vector3.Up()}
          sideOrientation={Mesh.BACKSIDE}
          ref={textPlaneRef}
        >
          <advancedDynamicTexture
            name="dialogTexture"
            height={1024}
            width={1024}
            createForParentMesh={true}
            hasAlpha={true}
            generateMipMaps={true}
            samplingMode={Texture.TRILINEAR_SAMPLINGMODE}
          >
            <rectangle
              name="rect-1"
              height={0.5}
              width={1}
              thickness={12}
              cornerRadius={12}
            >
              <rectangle>
                <babylon-button name="close-icon" background="green">
                  <textBlock
                    text="lolololol"
                    fontFamily="FontAwesome"
                    fontStyle="bold"
                    fontSize={200}
                    color="white"
                  />
                </babylon-button>
              </rectangle>
            </rectangle>
          </advancedDynamicTexture>
        </plane>
        */}
      </>
    );
  }
);

interface BallWithPhysicsProps {
  children?: React.ReactNode;
}

export const BallWithPhysics = forwardRef<
  Nullable<Mesh> | undefined,
  BallWithPhysicsProps
>((props, ref) => <Ball ref={ref} physicsEnabled {...props} />);

interface BallControlledProps {
  position: Position;
  rotation: Rotation;
}

export const BallControlled: React.FC<BallControlledProps> = ({
  position,
  rotation,
}) => <Ball position={position} rotation={rotation} />;
