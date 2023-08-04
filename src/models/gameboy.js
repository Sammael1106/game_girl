import React, { useRef } from "react";
import { MeshPhongMaterial, SRGBColorSpace, MeshBasicMaterial, MeshStandardMaterial, Vector2 } from 'three';
import { useGLTF, useTexture } from "@react-three/drei";
import { Leva, useControls } from "leva";


export function Gameboy(props) {
  const { nodes, materials } = useGLTF("models/gameboy_tex.glb");
  const texMap = new Map([
    // ['Color', null],
    // ['Metallic', null],
    // ['Normal', null],
    // ['Roughness', null],
    ['AO', null]
  ])

  texMap.forEach((map, key) => {
    const texture = useTexture(`textures/gameboy/${key}.jpg`)
    texture.flipY = false
    texture.colorSpace = SRGBColorSpace
    texMap.set(key, texture)
  })

  materials.Gameboy.aoMap = texMap.get('AO')

  const { rotation } = useControls({
    rotation: {value: -2.47, min: -3, max: 3, step: 0.05},
  })

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Gameboy.geometry}
        material={materials.Gameboy}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cartrige.geometry}
          material={materials.Gameboy}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Gameboy_buttons.geometry}
          material={materials.Gameboy}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Gameboy_lights.geometry}
          material={materials.Gameboy}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Gameboy_lights001.geometry}
          material={materials.Gameboy}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Gameboy_screen.geometry}
          material={materials.Gameboy}
          position={[0, 0.181, -0.85]}
          rotation={[rotation, 0, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Gameboy_side_button.geometry}
          material={materials.Gameboy}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("models/gameboy_tex.glb");
