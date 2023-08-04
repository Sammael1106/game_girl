"use client"

import * as THREE from 'three'
import { useRef, useCallback, useState } from 'react'
import { useLayoutEffect } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Text, OrbitControls, useGLTF, Environment, PresentationControls, Center } from '@react-three/drei'
import { Bloom, EffectComposer, Texture, Noise } from '@react-three/postprocessing'
import { GlitchMode, BlendFunction } from 'postprocessing'

import { Drunk, Overlay, Pencil } from '../vfx/custom_effects'
import { ScreenPortal } from '../components/screen_portal'
import { Leva, useControls } from "leva";

import { Gameboy } from '@/models/gameboy'


export default function App() {
  const customEffect = useRef()

  return (
    <>
      <Leva />
      <Canvas shadows camera={{ position: [0, 0, 13], fov: 35 }}>

        <color args={['pink']} attach="background" />

        {/* <OrbitControls makeDefault /> */}
        <PresentationControls global
                              // rotation={[0,0,0]}
                              // polar={ [ 0, 0.75 ] }
                              // azimuth={[ -0.5, 0.5 ]}
                              >
        <group position={[0, 2.25, -0.85]}>
          <ScreenPortal aspectRatio={3/2}
                        portalMesh={ <mesh><planeGeometry args={[3, 2.1]} /></mesh> }>
            <GameScene />
          </ScreenPortal>
        </group>

        <Gameboy scale={2} rotation={[0.9, 0, 0]} position={[0,-1.5,0]} />
        </PresentationControls>
        <Environment resolution={32} files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/drackenstein_quarry_1k.hdr"/>
        <EffectComposer>
          {/* <Pencil /> */}
          {/* <Overlay textureSrc="images/overlay.png" blendFunction={BlendFunction.COLOR_DODGE} opacity={1} repeat={'auto'}  /> */}
          {/* <Noise opacity={0.3} blendFunction={BlendFunction.MULTIPLY}/> */}
          {/* <Drunk frequency={2} amplitude={0.3} /> */}
          {/* <Vignette
              offset={ 0.2 }
              darkness={ 0.9 }
              blendFunction={ BlendFunction.DARKEN }
          /> */}
          {/* <Bloom mipmapBlur levels={9} intensity={1.5} luminanceThreshold={1} luminanceSmoothing={1} /> */}
        </EffectComposer>
      </Canvas>
    </>
  )
}


function GameScene() {
  const obj1 = useRef()
  const obj2 = useRef()

  useFrame(({ clock }) => {
    obj1.current.position.y = Math.cos(clock.elapsedTime / 2)
    obj2.current.position.y = Math.sin(clock.elapsedTime / 2)
  });

  return <>
    {/* <color args={['lightblue']} attach="background" /> */}
    <Text fontSize={3} color={'white'}>Hello world</Text>
    <axesHelper />
    <directionalLight />
    <Environment resolution={32} files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/drackenstein_quarry_1k.hdr"/>
    <mesh position={[0,0,-10]}>
      <planeGeometry args={[100,100]} />
      <meshBasicMaterial color={'#777873'} />
    </mesh>
    <mesh position={[-3, 1, -2]} ref={obj1}>
      <dodecahedronGeometry args={[2]} />
      <meshStandardMaterial
        roughness={1}
        color="blue"
      />
    </mesh>
    <mesh position={[3, -1, -2]} ref={obj2}>
      <dodecahedronGeometry args={[2]} />
      <meshStandardMaterial
        roughness={1}
        color="blue"
      />
    </mesh>
  </>
}
