import { TextureLoader, SRGBColorSpace, RepeatWrapping, Clock } from 'three'
import { useRef, forwardRef, useMemo, useLayoutEffect } from 'react'
import { useFrame, useLoader, useThree} from '@react-three/fiber'
import { TextureEffect } from 'postprocessing'
import DrunkEffect from './DrunkEffect'
import PencilEffect from './PencilEffect'

// Pencil
const Pencil = forwardRef((props, ref) => {
  const effect = new PencilEffect(props)
  return <primitive object={effect} ref={ref} dispose={null} />
})

// Drunk
const Drunk = forwardRef((props, ref) => {
  const effect = new DrunkEffect(props)
  return <primitive object={effect} ref={ref} dispose={null} />
})

// Overlay
const Overlay = forwardRef(({ textureSrc, ...props }, ref) => {
  const texture = useLoader(TextureLoader, textureSrc)
  const { viewport } = useThree()
  // const clock = useRef(new Clock())
  // useFrame(()=>{
  //   const elapsedTime = clock.current.getElapsedTime()
  //   if ( elapsedTime >= 0.1 ) {
  //     clock.current.start()
  //     texture.center.set( Math.random(), Math.random() )
  //   }
  // })

  useLayoutEffect(() => {
    texture.colorSpace = SRGBColorSpace
    texture.wrapS = texture.wrapT = RepeatWrapping
    if (props.repeat === 'auto') {
      texture.repeat.set( viewport.width/3, viewport.height/3 )
      texture.center.set( Math.random(), Math.random() )
    }
  }, [texture])
  const effect = useMemo(() => new TextureEffect({ ...props, texture: texture }), [props, texture])
  return <primitive ref={ref} object={effect} dispose={null} />
})

export { Drunk, Pencil, Overlay }