import * as THREE from 'three';
import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, KeyboardControls, Text, useKeyboardControls } from '@react-three/drei'
import { useKey } from 'react-use';
import { Perf } from 'r3f-perf';

const fieldSize = 9
const cellSize = 1

// Component representing a single cell in your 10x10 grid
function Cell(props) {
  const { position, type, index, isCurrent } = props
  let color = "lightgreen"
  if (type === "road") color = "gray"
  if (type === "water") color = "royalblue"
  if ( isCurrent ) color = "blue"
  return (
    <mesh rotation={[-Math.PI / 2, 0, -Math.PI]} position={position}>
      <Text fontSize={.5}>{index}</Text>
      <planeGeometry args={[ cellSize * 0.99, cellSize * 0.99]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

//
// Field
function Field(props) {
  const cells = [];
  let index = -1
  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < fieldSize; j++) {
      const position = [
        i * cellSize - (fieldSize * cellSize) / 2 + cellSize / 2,
        0,
        j * cellSize - (fieldSize * cellSize) / 2 + cellSize / 2
      ]
      index++
      let type = ''
      if (j === 2 || j === 3) type = "road"
      if (j === 5 || j === 6) type = "water"
      cells.push(
        <Cell position={position}
              type={type} key={`${i}-${j}`}
              index={index}
              cellSize={cellSize}
              isCurrent={props.currentIndex === index}/>);
    }
  }

  return <group {...props}>{cells}</group>;
}


//
// Player
function Frog() {
  return null
  return <mesh>
    <boxGeometry args={[0.5, 0.5, 0.5]} />
    <meshBasicMaterial color={'red'} />
  </mesh>
}


//
// Game
function Game() {
  const [currentIndex, setCurrentIndex] = useState(fieldSize * (Math.ceil(fieldSize / 2) - 1))

  useKey('ArrowUp', () => setCurrentIndex(prevIndex => prevIndex + 1), {}, [currentIndex]);
  useKey('ArrowLeft', () => setCurrentIndex(prevIndex => prevIndex + fieldSize), {}, [currentIndex]);
  useKey('ArrowRight', () => setCurrentIndex(prevIndex => prevIndex - fieldSize), {}, [currentIndex]);

  const { scene } = useThree();
  const refCube1 = useRef();
  const refCube2 = useRef();

  useFrame(({clock}) => {
    // refCube2.current.position.z = Math.sin(clock.elapsedTime) * 2;
    // refCube1.current.position.x = Math.sin(clock.elapsedTime) * 2;
    // checkIntersect(refCube1, refCube2) && console.log("Cubes are intersecting");
  });


  return <>
    <Frog currentIndex={currentIndex}/>
    <Field position={[0, 0, cellSize * fieldSize / 2]} currentIndex={currentIndex} />
    <WigglyBox size={4} speed={-3} row={2}/>
    <WigglyBox size={3} speed={5} row={3}/>
    <WigglyBox size={2} speed={-10} row={4} delay={6.9}/>
    <WigglyBox size={2} speed={-10} row={4} delay={3.4}/>
    <WigglyBox size={2} speed={-10} row={4} delay={0}/>

    {/* <mesh ref={refCube1}>
      <boxGeometry args={[3, 0.3, 0.1]} />
      <meshBasicMaterial color={'red'} />
    </mesh>

    <mesh ref={refCube2}>
      <icosahedronGeometry args={ [ 0.3, 1 ] } />
      <meshBasicMaterial color={'blue'} />
    </mesh> */}
  </>
}


// WigglyBox
function WigglyBox({ size, speed, row, delay = 0}) {
  const ref = useRef();
  const direction = speed > 0 ? -1 : 1
  const initialPosition = ((fieldSize * cellSize) / 2 + (cellSize * size ) / 2) * direction;
  // const shiftedPostion = cellSize/2 * shift * size - initialPosition
  useFrame(({ clock }) => {
    console.log(clock.elapsedTime > delay)
    if (clock.elapsedTime > delay) {
      // Move the box
      ref.current.position.x += 0.001 * speed;

      // If the box reached the left edge, move it back to the right edge
      if (direction > 0) {
        if (ref.current.position.x < -initialPosition)
        ref.current.position.x = initialPosition;
      } else {
        if (ref.current.position.x > -initialPosition)
          ref.current.position.x = initialPosition;
      }
      // Add the wiggling effect
      ref.current.position.y = Math.sin(clock.elapsedTime + delay) * 0.1 * direction;
      ref.current.rotation.z = Math.sin(clock.elapsedTime + delay) * 0.1 * direction;
    }
  });



  return (
    <mesh ref={ref} position={[initialPosition, 0, row + (cellSize/2)]}>
      <boxGeometry args={[size, 0.3, cellSize / 2]} />
      <meshBasicMaterial color={'purple'} />
    </mesh>
  );
}


//
// Main App component
export default function App() {
  return (
    <Canvas
      style={{ backgroundColor: '#000' }}
      camera={{ position: [0, 5, -8], fov: 35 }} >
      <OrbitControls />
      <Game/>
      <axesHelper />
      <Perf />
    </Canvas>
  );
}

function checkIntersect(object1, object2) {

  const boundingBox1 = new THREE.Box3().setFromObject(object1.current);
  const boundingBox2 = new THREE.Box3().setFromObject(object2.current);

  return boundingBox1.intersectsBox(boundingBox2)
}
