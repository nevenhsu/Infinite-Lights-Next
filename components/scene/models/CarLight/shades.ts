import { options } from '@/components/scene/config'

export const fragmentShader = `
varying vec3 vColor;
varying vec2 vUv; 
uniform vec2 uFade;

void main() {
  vec3 color = vec3(vColor);
  float fadeStart = 0.4;
  float maxFade = 0.;
  float alpha = 1.;
  
  alpha = smoothstep(uFade.x, uFade.y, vUv.x);
  gl_FragColor = vec4(color, alpha);
  if (gl_FragColor.a < 0.0001) discard;
}
`

export const vertexShader = `
attribute vec3 aOffset;
attribute vec3 aMetrics;
attribute vec3 aColor;

uniform float uTravelLength;
uniform float uTime;
uniform float uSpeed;

varying vec2 vUv;
varying vec3 vColor;

${options.distortion.getDistortion}

void main() {
  vec3 transformed = position.xyz;
  float radius = aMetrics.r;
  float myLength = aMetrics.g;
  float speed = aMetrics.b;

  transformed.xy *= radius ;
  transformed.z *= myLength;

  float zOffset = uTime * speed + aOffset.z;
  zOffset = myLength - mod(zOffset, uTravelLength);

  // Add my length to make sure it loops after the lights hits the end
  transformed.z += zOffset;
  transformed.xy += aOffset.xy;

  float progress = abs(transformed.z / uTravelLength);
  transformed.xyz += getDistortion(progress);

  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
  gl_Position = projectionMatrix * mvPosition;
  vUv = uv;
  vColor = aColor;
}
`
