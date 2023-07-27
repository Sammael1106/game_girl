"use client"

import * as THREE from 'three'
import { useRef, useCallback, useState } from 'react'
import { useLayoutEffect } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Center, AccumulativeShadows, RandomizedLight, OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei'
import { Bloom, EffectComposer, Texture, Noise } from '@react-three/postprocessing'
import { GlitchMode, BlendFunction } from 'postprocessing'

import { Drunk, Overlay, Pencil } from '../vfx/custom_effects'


export default function App() {
  const customEffect = useRef()


  return (
    <Canvas shadows camera={{ position: [8, 1.5, 8], fov: 25 }}>
      <color args={['pink']} attach="background" />
      <group position={[0, -0.5, 0]}>
        <Center top>
          <Suzi rotation={[-0.63, 0, 0]} scale={2} />
        </Center>
        <Center top position={[-2, 0, 1]}>
          <mesh castShadow>
            <sphereGeometry args={[0.25, 64, 64]} />
            <meshStandardMaterial color="lightblue" />
          </mesh>
        </Center>
        <Center top position={[2.5, 0, 1]}>
          <mesh castShadow rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="indianred" />
          </mesh>
        </Center>
        <AccumulativeShadows temporal frames={100} color="orange" colorBlend={2} toneMapped={true} alphaTest={0.9} opacity={2} scale={12}>
          <RandomizedLight amount={8} radius={4} ambient={0.5} intensity={1} position={[5, 5, -10]} bias={0.001} />
        </AccumulativeShadows>
      </group>
      <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
      <Environment resolution={32} files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/drackenstein_quarry_1k.hdr"/>

      <EffectComposer disableNormalPass>
        {/* <Pencil /> */}
        <Overlay textureSrc="images/overlay.png" blendFunction={BlendFunction.COLOR_DODGE} opacity={1} repeat={'auto'}  />
        <Noise opacity={0.3} blendFunction={BlendFunction.MULTIPLY}/>
        {/* <Drunk frequency={2} amplitude={0.3} /> */}
        {/* <Vignette
            offset={ 0.2 }
            darkness={ 0.9 }
            blendFunction={ BlendFunction.DARKEN }
        /> */}
        <Bloom mipmapBlur levels={9} intensity={1.5} luminanceThreshold={1} luminanceSmoothing={1} />
      </EffectComposer>
    </Canvas>
  )
}


function Suzi(props) {
  const { scene, materials, nodes } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/suzanne-high-poly/model.gltf')


  return (
    <mesh geometry={ nodes.Suzanne.geometry }
          position={ nodes.Suzanne.position }
          rotation={ nodes.Suzanne.rotation } materials={materials}>

    </mesh>
  )
}
