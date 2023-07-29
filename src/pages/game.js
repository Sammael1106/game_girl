import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, KeyboardControls, Text, useKeyboardControls } from '@react-three/drei'
import { useKey } from 'react-use';

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

  return <>
    <Frog currentIndex={currentIndex}/>
    <Field position={[0, 0, cellSize * fieldSize / 2]} currentIndex={currentIndex} />
  </>
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
    </Canvas>
  );
}
