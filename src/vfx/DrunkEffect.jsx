import { BlendFunction, Effect } from 'postprocessing'
import { Uniform } from 'three'
import fragmentShader from "../glsl/drunk.glsl";

export default class DrunkEffect extends Effect {
  constructor({ frequency, amplitude, blendFunction = BlendFunction.MULTIPLY }) {
    super(
      'DrunkEffect',
      fragmentShader, {
        blendFunction: blendFunction,
        uniforms: new Map([
          ['frequency', new Uniform(frequency)],
          ['amplitude', new Uniform(amplitude)],
          ['offset', new Uniform(0)]
        ])
      }
    )
  }
  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get('offset').value += deltaTime
  }
}
