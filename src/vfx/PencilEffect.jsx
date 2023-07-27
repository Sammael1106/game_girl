import { BlendFunction, Effect } from 'postprocessing'
import { Uniform } from 'three'
import fragmentShader from "../glsl/pencil.glsl";

export default class PencilEffect extends Effect {
  constructor({ frequency, amplitude, blendFunction = BlendFunction.NORMAL }) {
    super(
      'PencilEffect',
      fragmentShader, {
        blendFunction: blendFunction,
        uniforms: new Map([
        ])
      }
    )
  }
  update(renderer, inputBuffer, deltaTime) {
  }
}
