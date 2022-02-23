import React, { forwardRef } from 'react';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { Nullable } from '@babylonjs/core/types';
import { PhysicsImpostor } from '@babylonjs/core/Physics/physicsImpostor';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { FresnelParameters } from '@babylonjs/core/Materials/fresnelParameters';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { IPosition } from './types';

interface BallProps {
  position?: IPosition;
  rotation?: IPosition;
}

export const Ball = forwardRef<Nullable<Mesh> | undefined, BallProps>(
  ({ position, rotation }, ref) => {
    return (
      <sphere
        ref={ref}
        name="sphere1"
        diameter={2}
        segments={16}
        position={
          position
            ? new Vector3(position.x, position.y, position.z)
            : new Vector3(0, 1.5, 0)
        }
        rotation={
          rotation
            ? new Vector3(rotation.x, rotation.y, rotation.z)
            : new Vector3(0, 0, 0)
        }
      >
        {!position && (
          <physicsImpostor
            type={PhysicsImpostor.SphereImpostor}
            _options={{ mass: 1, restitution: 0.9 }}
          />
        )}
        <standardMaterial
          name="material1"
          specularPower={16}
          diffuseColor={Color3.Black()}
          emissiveColor={new Color3(0.5, 0.5, 0.5)}
          reflectionFresnelParameters={FresnelParameters.Parse({
            isEnabled: true,
            leftColor: [1, 1, 1],
            rightColor: [0, 0, 0],
            bias: 0.1,
            power: 1,
          })}
        />
        <plane
          name="dialog"
          size={2}
          position={new Vector3(0, 1.5, 0)}
          sideOrientation={Mesh.BACKSIDE}
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
      </sphere>
    );
  }
);
