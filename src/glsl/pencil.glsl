void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 color = inputColor.rgb;
  color = color * vec3(uv, 1);
  outputColor = vec4(0,0,0, inputColor.a);
}

// void main() {
//   float sobelValue = combinedSobelValue();
//   sobelValue = smoothstep(0.01, 0.03, sobelValue);

//   vec4 lineColor = vec4(0.32, 0.12, 0.2, 1.0);

//   if (sobelValue > 0.1) {
//       gl_FragColor = lineColor;
//   } else {
//       gl_FragColor = vec4(1.0);
//   }
// }