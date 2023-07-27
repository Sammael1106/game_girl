uniform float frequency;
uniform float amplitude;
uniform float offset;

void mainUv(inout vec2 uv) {
  uv.y += sin(uv.x * frequency + offset) * amplitude;
}
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // const vec2 center = vec2(0.5);
  // vec3 color = inputColor.rgb;
  // vec2 coord = (uv - center) * vec2(offset);
  // color = mix(color, vec3(1.0 - darkness), dot(coord, coord));
  // outputColor = vec4(color, inputColor.a);
  const vec2 center = vec2(0.5);
  float d = distance(uv, center);

  vec3 color = inputColor.rgb;
  color *= vec3(1.0, 1.0, 2.0 * d);
  outputColor = vec4(color, inputColor.a);
}
