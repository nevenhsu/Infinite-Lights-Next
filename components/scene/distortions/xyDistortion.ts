import { Uniform, Vector2, Vector3 } from 'three'

const xyUniforms = {
  uFreq: new Uniform(new Vector2(5, 2)),
  uAmp: new Uniform(new Vector2(25, 15)),
}

const vertex = `
#define PI 3.14159265358979

uniform vec2 uFreq;
uniform vec2 uAmp;
	
vec3 getDistortion(float progress){
  float movementProgressFix = 0.02;

  return vec3( 
    cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(movementProgressFix * PI * uFreq.x + uTime) * uAmp.x,
    sin(progress * PI * uFreq.y + PI/2. + uTime) * uAmp.y - sin(movementProgressFix * PI * uFreq.y + PI/2. + uTime) * uAmp.y,
    0.
  );
}
`

const getJS = (progress: number, time: number) => {
  const movementProgressFix = 0.02

  const uFreq = xyUniforms.uFreq.value
  const uAmp = xyUniforms.uAmp.value

  const distortion = new Vector3(
    Math.cos(progress * Math.PI * uFreq.x + time) * uAmp.x -
      Math.cos(movementProgressFix * Math.PI * uFreq.x + time) * uAmp.x,
    Math.sin(progress * Math.PI * uFreq.y + time + Math.PI / 2) * uAmp.y -
      Math.sin(movementProgressFix * Math.PI * uFreq.y + time + Math.PI / 2) * uAmp.y,
    0
  )
  const lookAtAmp = new Vector3(2, 0.4, 1)
  const lookAtOffset = new Vector3(0, 0, -3)

  return distortion.multiply(lookAtAmp).add(lookAtOffset)
}

export const xyDistortion = {
  uniforms: xyUniforms,
  getDistortion: vertex,
  getJS,
}
