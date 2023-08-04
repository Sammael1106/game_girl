import * as THREE from "three";
import {
  OrbitControls,
  Center,
  Environment,
  useFBO,
  Text,
  PerspectiveCamera,
  OrthographicCamera
} from "@react-three/drei";
import { Canvas, useFrame, createPortal, useThree, useLoader, extend } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import { useRef, useMemo, useState, useEffect, useLayoutEffect, cloneElement } from "react";
import { PixelatePass } from '../shaders/PixelatePass';
import { RenderPixelatedPass } from '../shaders/RenderPixelatedPass';

// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

import {
  EffectComposer,
  KernelSize,
  BloomEffect,
  EffectPass,
  RenderPass,
  CopyPass,
  BlendFunction,
  ClearPass,
  SavePass,
  TextureEffect,
  NoiseEffect,
  GridEffect,
  OutlineEffect,
  OutlinePass
} from "postprocessing";


export const ScreenPortal = ({portalMesh, children, aspectRatio}, ref) => {
  const portalMeshRef = useRef();
  portalMesh = cloneElement(portalMesh, { ref: portalMeshRef });
  const portalCamera = useRef();
  const portalScene = new THREE.Scene();
  const renderTarget = useFBO();
  const screenMaterial = new THREE.MeshBasicMaterial()
  const { gl, camera, scene } = useThree();
  const [refresh, setRefresh] = useState(false);


  const { blendFunction, pixelResolution, gridScale, noise} = useControls({
    blendFunction: {value: 29,  min: 0, max: 32, step: 1},
    pixelResolution: {value: 5,  min: 0, max: 10, step: 0.1},
    gridScale: {value: 0.8, min: 0, max: 3, step: 0.1},
    noise: {value: 0, min: 0, max: 3, step: 0.1},
  })

  let screenResolution = new THREE.Vector2( window.innerWidth, window.innerHeight )
  let renderResolution = screenResolution.clone().divideScalar(pixelResolution);
  renderResolution.x |= 0;
  renderResolution.y |= 0;

  let composer = useMemo(() => {
    if (!portalCamera.current?.position) return;
    const composer = new EffectComposer(gl);
    composer.autoRenderToScreen = false;

    // Noise
    const noiseEffect = new NoiseEffect({
      blendFunction: 12,
      premultiply: true
    })
    noiseEffect.blendMode.opacity = new THREE.Uniform(noise)

    // Grid
    const gridEffect = new GridEffect({
      lineWidth: 0.1,
      blendFunction: blendFunction,
      scale: gridScale
    })

    // Outline
    const outlineEffect = new OutlineEffect({

    })

    // Pixels
    const renderPass = new RenderPass(portalScene, portalCamera.current);
    const copyPass = new CopyPass(renderTarget);
    const noisePass = new EffectPass(portalCamera.current, noiseEffect)
    const gridPass = new EffectPass(portalCamera.current, gridEffect)
    const renderPixelatedPass = new RenderPixelatedPass(renderResolution, portalScene, portalCamera.current);
    const pixelatePass = new PixelatePass(renderResolution);
    // const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera, null);
    // outlinePass.renderToScreen = true;
    // outlinePass.selectedObjects = selectedObjects;


    composer.addPass(renderPass);
    composer.addPass(renderPixelatedPass);
    composer.addPass(pixelatePass);
    composer.addPass(noisePass);
    // composer.addPass(outlinePass);
    composer.addPass(gridPass);
    composer.addPass(copyPass);

    return composer;
  }, [gl, portalScene, portalCamera?.current, renderTarget, refresh]);

  useLayoutEffect(() => {
    if (portalMeshRef.current) {
      portalMeshRef.current.material.map = renderTarget.texture
    }
  })

  useFrame(() => {
    portalCamera.current.matrixWorldInverse.copy(camera.matrixWorldInverse);
    portalCamera.current.projectionMatrixInverse.copy(camera.projectionMatrixInverse);
    if (composer) composer.render();
    else if (portalCamera.current?.position && !refresh) setRefresh(true);
    gl.setRenderTarget(null);
  });

  return (
    <>
      <PerspectiveCamera
        ref={portalCamera}
        manual
        aspect={aspectRatio}
      >
      { createPortal(children, portalScene) }
      </PerspectiveCamera>

      {portalMesh}
    </>
  );
};
