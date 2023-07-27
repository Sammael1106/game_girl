import { TextureEffect } from 'postprocessing'
import { Ref, forwardRef, useMemo, useLayoutEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { TextureLoader, sRGBEncoding, RepeatWrapping } from 'three'
